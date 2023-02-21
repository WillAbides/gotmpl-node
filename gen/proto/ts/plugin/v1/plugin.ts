/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";
import { Value } from "../../google/protobuf/struct";

export const protobufPackage = "plugin.v1";

export interface ListFunctionsRequest {
}

export interface ListFunctionsResponse {
  functions: string[];
}

export interface ExecuteFunctionRequest {
  /** The name of the function to execute. */
  function: string;
  /** The arguments to the function. */
  args: any[];
}

export interface ExecuteFunctionResponse {
  /** The result of the function. */
  result: any | undefined;
}

function createBaseListFunctionsRequest(): ListFunctionsRequest {
  return {};
}

export const ListFunctionsRequest = {
  encode(_: ListFunctionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListFunctionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListFunctionsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): ListFunctionsRequest {
    return {};
  },

  toJSON(_: ListFunctionsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<ListFunctionsRequest>): ListFunctionsRequest {
    return ListFunctionsRequest.fromPartial(base ?? {});
  },

  fromPartial(_: DeepPartial<ListFunctionsRequest>): ListFunctionsRequest {
    const message = createBaseListFunctionsRequest();
    return message;
  },
};

function createBaseListFunctionsResponse(): ListFunctionsResponse {
  return { functions: [] };
}

export const ListFunctionsResponse = {
  encode(message: ListFunctionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.functions) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListFunctionsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListFunctionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.functions.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListFunctionsResponse {
    return { functions: Array.isArray(object?.functions) ? object.functions.map((e: any) => String(e)) : [] };
  },

  toJSON(message: ListFunctionsResponse): unknown {
    const obj: any = {};
    if (message.functions) {
      obj.functions = message.functions.map((e) => e);
    } else {
      obj.functions = [];
    }
    return obj;
  },

  create(base?: DeepPartial<ListFunctionsResponse>): ListFunctionsResponse {
    return ListFunctionsResponse.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<ListFunctionsResponse>): ListFunctionsResponse {
    const message = createBaseListFunctionsResponse();
    message.functions = object.functions?.map((e) => e) || [];
    return message;
  },
};

function createBaseExecuteFunctionRequest(): ExecuteFunctionRequest {
  return { function: "", args: [] };
}

export const ExecuteFunctionRequest = {
  encode(message: ExecuteFunctionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.function !== "") {
      writer.uint32(10).string(message.function);
    }
    for (const v of message.args) {
      Value.encode(Value.wrap(v!), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExecuteFunctionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExecuteFunctionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.function = reader.string();
          break;
        case 2:
          message.args.push(Value.unwrap(Value.decode(reader, reader.uint32())));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ExecuteFunctionRequest {
    return {
      function: isSet(object.function) ? String(object.function) : "",
      args: Array.isArray(object?.args) ? [...object.args] : [],
    };
  },

  toJSON(message: ExecuteFunctionRequest): unknown {
    const obj: any = {};
    message.function !== undefined && (obj.function = message.function);
    if (message.args) {
      obj.args = message.args.map((e) => e);
    } else {
      obj.args = [];
    }
    return obj;
  },

  create(base?: DeepPartial<ExecuteFunctionRequest>): ExecuteFunctionRequest {
    return ExecuteFunctionRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<ExecuteFunctionRequest>): ExecuteFunctionRequest {
    const message = createBaseExecuteFunctionRequest();
    message.function = object.function ?? "";
    message.args = object.args?.map((e) => e) || [];
    return message;
  },
};

function createBaseExecuteFunctionResponse(): ExecuteFunctionResponse {
  return { result: undefined };
}

export const ExecuteFunctionResponse = {
  encode(message: ExecuteFunctionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== undefined) {
      Value.encode(Value.wrap(message.result), writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExecuteFunctionResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExecuteFunctionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = Value.unwrap(Value.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ExecuteFunctionResponse {
    return { result: isSet(object?.result) ? object.result : undefined };
  },

  toJSON(message: ExecuteFunctionResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = message.result);
    return obj;
  },

  create(base?: DeepPartial<ExecuteFunctionResponse>): ExecuteFunctionResponse {
    return ExecuteFunctionResponse.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<ExecuteFunctionResponse>): ExecuteFunctionResponse {
    const message = createBaseExecuteFunctionResponse();
    message.result = object.result ?? undefined;
    return message;
  },
};

export type PluginServiceDefinition = typeof PluginServiceDefinition;
export const PluginServiceDefinition = {
  name: "PluginService",
  fullName: "plugin.v1.PluginService",
  methods: {
    /** ListFunctions returns a list of functions provided by the plugin. */
    listFunctions: {
      name: "ListFunctions",
      requestType: ListFunctionsRequest,
      requestStream: false,
      responseType: ListFunctionsResponse,
      responseStream: false,
      options: {},
    },
    /** ExecuteFunction executes the function with the given name and arguments. */
    executeFunction: {
      name: "ExecuteFunction",
      requestType: ExecuteFunctionRequest,
      requestStream: false,
      responseType: ExecuteFunctionResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface PluginServiceImplementation<CallContextExt = {}> {
  /** ListFunctions returns a list of functions provided by the plugin. */
  listFunctions(
    request: ListFunctionsRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<ListFunctionsResponse>>;
  /** ExecuteFunction executes the function with the given name and arguments. */
  executeFunction(
    request: ExecuteFunctionRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<ExecuteFunctionResponse>>;
}

export interface PluginServiceClient<CallOptionsExt = {}> {
  /** ListFunctions returns a list of functions provided by the plugin. */
  listFunctions(
    request: DeepPartial<ListFunctionsRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ListFunctionsResponse>;
  /** ExecuteFunction executes the function with the given name and arguments. */
  executeFunction(
    request: DeepPartial<ExecuteFunctionRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ExecuteFunctionResponse>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
