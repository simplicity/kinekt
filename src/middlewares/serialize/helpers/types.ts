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

export type SerializeContextExtension = {
  response:
    | BasePipelineContextResponse & {
        serializedBody: SerializedBody;
      };
};

export type SerializeContext = BasePipelineContext & SerializeContextExtension;
