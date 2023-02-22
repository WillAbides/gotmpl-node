/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";
import { Value } from "../../google/protobuf/struct";

export const protobufPackage = "gotmpl.v1";

export interface ExecuteRequest {
  /** template is the go template to execute. */
  template: string;
  /** data is the data to use as the root context when executing the template. */
  data:
    | any
    | undefined;
  /**
   * missingkey is the missing key behavior for the template. Must be "invalid", "error", or "zero".
   * Defaults to "invalid".
   */
  missingkey?:
    | string
    | undefined;
  /**
   * package is the package for the template. Must be "text" or "html".
   * Defaults to "text".
   */
  package?: string | undefined;
}

export interface ExecuteResponse {
  /** result is the result of executing the template. */
  result: string;
}

function createBaseExecuteRequest(): ExecuteRequest {
  return { template: "", data: undefined, missingkey: undefined, package: undefined };
}

export const ExecuteRequest = {
  encode(message: ExecuteRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.template !== "") {
      writer.uint32(10).string(message.template);
    }
    if (message.data !== undefined) {
      Value.encode(Value.wrap(message.data), writer.uint32(18).fork()).ldelim();
    }
    if (message.missingkey !== undefined) {
      writer.uint32(26).string(message.missingkey);
    }
    if (message.package !== undefined) {
      writer.uint32(34).string(message.package);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExecuteRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExecuteRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.template = reader.string();
          break;
        case 2:
          message.data = Value.unwrap(Value.decode(reader, reader.uint32()));
          break;
        case 3:
          message.missingkey = reader.string();
          break;
        case 4:
          message.package = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ExecuteRequest {
    return {
      template: isSet(object.template) ? String(object.template) : "",
      data: isSet(object?.data) ? object.data : undefined,
      missingkey: isSet(object.missingkey) ? String(object.missingkey) : undefined,
      package: isSet(object.package) ? String(object.package) : undefined,
    };
  },

  toJSON(message: ExecuteRequest): unknown {
    const obj: any = {};
    message.template !== undefined && (obj.template = message.template);
    message.data !== undefined && (obj.data = message.data);
    message.missingkey !== undefined && (obj.missingkey = message.missingkey);
    message.package !== undefined && (obj.package = message.package);
    return obj;
  },

  create(base?: DeepPartial<ExecuteRequest>): ExecuteRequest {
    return ExecuteRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<ExecuteRequest>): ExecuteRequest {
    const message = createBaseExecuteRequest();
    message.template = object.template ?? "";
    message.data = object.data ?? undefined;
    message.missingkey = object.missingkey ?? undefined;
    message.package = object.package ?? undefined;
    return message;
  },
};

function createBaseExecuteResponse(): ExecuteResponse {
  return { result: "" };
}

export const ExecuteResponse = {
  encode(message: ExecuteResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== "") {
      writer.uint32(10).string(message.result);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExecuteResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExecuteResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ExecuteResponse {
    return { result: isSet(object.result) ? String(object.result) : "" };
  },

  toJSON(message: ExecuteResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = message.result);
    return obj;
  },

  create(base?: DeepPartial<ExecuteResponse>): ExecuteResponse {
    return ExecuteResponse.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<ExecuteResponse>): ExecuteResponse {
    const message = createBaseExecuteResponse();
    message.result = object.result ?? "";
    return message;
  },
};

export type GotmplServiceDefinition = typeof GotmplServiceDefinition;
export const GotmplServiceDefinition = {
  name: "GotmplService",
  fullName: "gotmpl.v1.GotmplService",
  methods: {
    /** Execute executes a go template. */
    execute: {
      name: "Execute",
      requestType: ExecuteRequest,
      requestStream: false,
      responseType: ExecuteResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface GotmplServiceImplementation<CallContextExt = {}> {
  /** Execute executes a go template. */
  execute(request: ExecuteRequest, context: CallContext & CallContextExt): Promise<DeepPartial<ExecuteResponse>>;
}

export interface GotmplServiceClient<CallOptionsExt = {}> {
  /** Execute executes a go template. */
  execute(request: DeepPartial<ExecuteRequest>, options?: CallOptions & CallOptionsExt): Promise<ExecuteResponse>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
