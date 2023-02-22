import {spawn} from 'child_process';
import {createChannel, createClient, createServer} from 'nice-grpc';
import {
  ExecuteRequest,
  GotmplServiceDefinition,
} from '../gen/proto/ts/gotmpl/v1/gotmpl';
import {
  ExecuteFunctionRequest,
  ExecuteFunctionResponse,
  ListFunctionsResponse,
  PluginServiceDefinition,
  PluginServiceImplementation,
} from '../gen/proto/ts/plugin/v1/plugin';

// Options for executing a template.
interface GotmplExecOptions {
  // The data to pass to the template.
  data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  // The missingkey option to set. Must be "invalid", "error", or "zero".
  // See https://pkg.go.dev/text/template#Template.Option.
  // Defaults to "invalid".
  missingkey?: string;
  // package is the go package for the template. Must be either "text" template/text or "html" for template/html.
  // Defaults to "text".
  package?: string;
}

// Base options for gotmpl.
interface GotmplOptions {
  // The gotmpl binary to use. Defaults to "gotmpl".
  gotmplBin?: string;
  // Plugins to load.
  plugins?: string[];
  // Functions to make available to the template.
  functions?: {[name: string]: Function};
}

// Runs `gotmpl exec` with the given template and options. This is useful when you only have a few templates to execute
// and don't want the overhead of starting a server. If you have a lot of templates or need to execute them
// concurrently, you should use gotmplServer instead.
export async function gotmplExec(
  template: string,
  options: GotmplOptions & GotmplExecOptions = {}
): Promise<string> {
  const args = [
    'exec',
    template,
    JSON.stringify(options.data),
    '--missingkey',
    options.missingkey || 'invalid',
    '--package',
    options.package || 'text',
  ];
  const pluginServer = await handleCommonOptions(options, args);
  let result = '';
  try {
    const bin = options.gotmplBin || 'gotmpl';
    const cmd = spawn(bin, args);
    cmd.stdout.on('data', data => {
      result += data.toString();
    });
    const code = await new Promise(resolve => {
      cmd.on('close', code => {
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

interface GotmplServer {
  execute(template: string, options: GotmplExecOptions): Promise<string>;

  stop(): Promise<void>;
}

// Runs `gotmpl server` and returns a method for executing templates. This is useful when you have a lot of templates
// or need to execute them concurrently. If you only have a few templates to execute, you should use gotmplExec instead.
// The returned server must be stopped with the stop method when you are done with it. After stopping, calls to
// execute will fail.
export async function gotmplServer(
  options: GotmplOptions = {}
): Promise<GotmplServer> {
  const args = ['server', '--address', 'localhost:0'];
  const pluginServer = await handleCommonOptions(options, args);
  const process = spawn(options.gotmplBin || 'gotmpl', args);
  return new Promise(resolve => {
    process.stdout.on('data', data => {
      const line = data.toString();
      const match = line.match(/listening on (.+)/);
      if (match) {
        const channel = createChannel(match[1]);
        const client = createClient(GotmplServiceDefinition, channel);
        resolve({
          execute: async (
            template: string,
            options: GotmplExecOptions = {}
          ): Promise<string> => {
            const reqData = options.data || {};
            const request: ExecuteRequest = {
              ...options,
              template,
              data: reqData,
            };
            const response = await client.execute(request);
            return response.result;
          },
          stop: async () => {
            channel.close();
            process.kill();
            await new Promise<void>(resolve => {
              process.on('close', () => {
                resolve();
              });
            });
            if (pluginServer) {
              await pluginServer.shutdown();
            }
          },
        });
      }
    });
  });
}

async function handleCommonOptions(
  options: GotmplOptions,
  args: string[]
): Promise<ReturnType<typeof createServer> | undefined> {
  for (const plugin of options.plugins || []) {
    args.push('--plugin', plugin);
  }
  let pluginServer: ReturnType<typeof createServer> | undefined;
  if (options.functions && Object.keys(options.functions).length > 0) {
    pluginServer = createServer();
    pluginServer.add(
      PluginServiceDefinition,
      newPluginService(options.functions)
    );
    const pluginServerPort = await pluginServer.listen('localhost:0');
    args.push('--grpc-plugin', `localhost:${pluginServerPort}`);
  }
  return pluginServer;
}

function newPluginService(functions: {
  [name: string]: Function;
}): PluginServiceImplementation {
  return {
    listFunctions: async (): Promise<ListFunctionsResponse> => {
      return Promise.resolve({
        functions: Object.keys(functions).sort(),
      });
    },
    executeFunction: async (
      req: ExecuteFunctionRequest
    ): Promise<ExecuteFunctionResponse> => {
      const func = functions[req.function];
      if (!func) {
        throw new Error(`Function ${req.function} not found`);
      }
      return new Promise(resolve => {
        const result = func(...req.args);
        if (result instanceof Promise) {
          result.then(value => resolve({result: value}));
        } else {
          resolve({result});
        }
      });
    },
  };
}
