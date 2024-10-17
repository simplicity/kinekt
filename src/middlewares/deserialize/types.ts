import type {
  BasePipelineContext,
  BasePipelineContextRequest,
} from "../../createPipeline/types";

export type DeserializedBody =
  | {
      type: "unset";
    }
  | {
      type: "set";
      body: unknown;
    };

export type DeserializeContextExtension = {
  request: BasePipelineContextRequest & {
    deserializedBody: DeserializedBody;
  };
};

export type DeserializeContext = BasePipelineContext &
  DeserializeContextExtension;
