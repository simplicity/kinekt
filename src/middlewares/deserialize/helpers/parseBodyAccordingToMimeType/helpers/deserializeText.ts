import type { BasePipelineContext } from "../../../../../createPipeline/types";
import { okResult } from "../../../../../helpers/result";

export async function deserializeText(context: BasePipelineContext) {
  return context.request.readText().then((text) => okResult(text));
}
