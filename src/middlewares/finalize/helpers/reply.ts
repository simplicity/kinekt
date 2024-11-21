import type { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { FinalizeContext, FinalizedResponse } from "./types";

export function reply(
  context: BasePipelineContext,
  finalizedResponse: FinalizedResponse
): FinalizeContext {
  return {
    ...context,
    finalizedResponse,
  };
}
