import { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { FinalizeContextExtension } from "./types";

export function isFinalized(
  context: BasePipelineContext
): context is BasePipelineContext & FinalizeContextExtension {
  return (
    (context as BasePipelineContext & FinalizeContextExtension)
      .finalizedResponse !== undefined
  );
}
