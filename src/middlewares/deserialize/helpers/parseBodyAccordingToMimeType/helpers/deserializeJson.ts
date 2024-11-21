import type { BasePipelineContext } from "../../../../../createPipeline/helpers/types";
import { parseJsonFromText } from "../../../../../helpers/parseJsonFromText";
import { okResult } from "../../../../../helpers/result";

export async function deserializeJson(context: BasePipelineContext) {
  const text = await context.request.readText();

  if (text === "") {
    return okResult(null);
  }

  return parseJsonFromText(text);
}
