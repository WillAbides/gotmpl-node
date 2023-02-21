import {ChildProcessWithoutNullStreams, spawn, spawnSync} from 'child_process';
import {createChannel, createClient, createServer} from 'nice-grpc';
import {GotmplServiceDefinition} from '../gen/proto/ts/gotmpl/v1/gotmpl';
import {
  ExecuteFunctionRequest,
  ExecuteFunctionResponse,
  ListFunctionsRequest,
  ListFunctionsResponse,
  PluginServiceDefinition,
  PluginServiceImplementation
} from '../gen/proto/ts/plugin/v1/plugin';

export interface GotmplOptions {
  path?: string;
  plugins?: string[];
  functions?: { [name: string]: Function };
}

export interface GotmplRequestOptions {
  // missingkey is the missing key behavior for the template. Must be "invalid", "error", or "zero".
  // See https://pkg.go.dev/text/template#Template.Option
  // Defaults to "invalid".
  missingkey?: string;
  // package is the package for the template. Must be "text" or "html".
  // Defaults to "text".
  package?: string;
}

export class Gotmpl {
  private readonly path: string;
  private readonly plugins: string[];
  private readonly functions: { [name: string]: Function };
  private process?: ChildProcessWithoutNullStreams;
  private channel?: ReturnType<typeof createChannel>;
  private pluginServer?: ReturnType<typeof createServer>;

  constructor(options: GotmplOptions = {}) {
    this.path = options.path || 'gotmpl';
    this.plugins = options.plugins || [];
    this.functions = options.functions || {};
  }

  async startServer(): Promise<void> {
    if (this.process) {
      throw new Error('Gotmpl already started');
    }
    const args = ['server', '--address', 'localhost:0'];
    for (const plugin of this.plugins) {
      args.push('--plugin', plugin);
    }
    if (Object.keys(this.functions).length > 0) {
      this.pluginServer = createServer();
      this.pluginServer.add(PluginServiceDefinition, new Plugin(this.functions))
      const pluginServerPort = await this.pluginServer.listen('localhost:0');
      args.push('--grpc-plugin', `localhost:${pluginServerPort}`);
    }
    return new Promise((resolve, reject) => {
      this.process = spawn(this.path, args);
      this.process.stdout.on('data', (data) => {
        const line = data.toString();
        const match = line.match(/listening on (.+)/);
        if (match) {
          this.channel = createChannel(match[1]);
          resolve();
        }
      });
    });
  }

  async stopServer(): Promise<void> {
    if (this.pluginServer) {
      await this.pluginServer.shutdown()
      this.pluginServer = undefined;
    }
    if (this.channel) {
      this.channel.close();
      this.channel = undefined;
    }
    if (this.process) {
      this.process.kill();
      this.process = undefined;
    }
  }

  async execServerRequest(template: string, data?: any, options: GotmplRequestOptions = {}): Promise<string> {
    if (!this.channel) {
      throw new Error('Gotmpl not started');
    }
    const client = createClient(GotmplServiceDefinition, this.channel);
    const response = await client.execute({
      template,
      data,
      ...options,
    });
    return response.result;
  }

  async execCommandRequest(template: string, data?: any, options: GotmplRequestOptions = {}): Promise<string> {
    const args = ['exec', template, JSON.stringify(data || null)];
    if (options.missingkey) {
      args.push('--missingkey', options.missingkey);
    }
    if (options.package) {
      args.push('--package', options.package);
    }
    for (const plugin of this.plugins) {
      args.push('--command-plugin', plugin);
    }
    let pluginServer: ReturnType<typeof createServer> | undefined;
    if (Object.keys(this.functions).length > 0) {
      pluginServer = createServer();
      pluginServer.add(PluginServiceDefinition, new Plugin(this.functions))
      const pluginServerPort = await pluginServer.listen('localhost:0');
      args.push('--grpc-plugin', `localhost:${pluginServerPort}`);
    }
    let result: string = '';
    try {
      const cmd = spawn(this.path, args);
      cmd.stdout.on('data', (data) => {
        result += data.toString();
      });
      const code = await new Promise((resolve) => {
        cmd.on('close', (code) => {
          resolve(code);
        });
      });
      if (code !== 0) {
        throw new Error(`Gotmpl exited with status ${code}`);
      }
    } finally {
      if (pluginServer) {
        await pluginServer.shutdown();
      }
    }
    return result;
  }
}

class Plugin implements PluginServiceImplementation {
  constructor(private readonly functions: { [name: string]: Function }) {
  }

  async listFunctions(req: ListFunctionsRequest): Promise<ListFunctionsResponse> {
    return Promise.resolve({
      functions: Object.keys(this.functions).sort()
    });
  }

  async executeFunction(req: ExecuteFunctionRequest): Promise<ExecuteFunctionResponse> {
    const func = this.functions[req.function];
    if (!func) {
      throw new Error(`Function ${req.function} not found`);
    }
    return new Promise((resolve) => {
      const result = func(...req.args);
      if (result instanceof Promise) {
        result.then((value) => resolve({result: value}));
      } else {
        resolve({result});
      }
    });
  }
}
