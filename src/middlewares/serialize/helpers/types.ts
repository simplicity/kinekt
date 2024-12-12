import type {
  BasePipelineContext,
  BasePipelineContextResponse,
} from "../../../createPipeline/helpers/types";

export type SerializedBody =
  | {
      type: "unset";
    }
  | {
      type: "set";
      body: unknown;
    };

export type BasePipelineContextResponseWithSerializedBody =
  BasePipelineContextResponse & {
    serializedBody: SerializedBody;
  };

export type SerializeContextExtension = {
  response: BasePipelineContextResponseWithSerializedBody;
};

export type SerializeContext = BasePipelineContext & SerializeContextExtension;
