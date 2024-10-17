import { BasePipelineContext } from "../../createPipeline/types";
import { StatusCode } from "../../types";

export type FinalizedResponse = {
  type: "ok" | "error-occured" | "no-response-set" | "no-serialized-body-set";
  statusCode: StatusCode;
  body: unknown;
  headers: Record<string, string>;
};

export type FinalizeContextExtension = {
  finalizedResponse: FinalizedResponse;
};

export type FinalizeContext = BasePipelineContext & FinalizeContextExtension;
