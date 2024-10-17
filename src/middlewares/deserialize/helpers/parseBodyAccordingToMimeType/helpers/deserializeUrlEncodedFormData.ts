import type { BasePipelineContext } from "../../../../../createPipeline/types";
import { okResult } from "../../../../../helpers/result";

function parseUrlEncodedFormData(body: string) {
  const params = new URLSearchParams(body);

  const data: Record<any, any> = {};

  params.forEach((value, key) => {
    data[key] = value;
  });

  return data;
}

export async function deserializeUrlEncodedFormData(
  context: BasePipelineContext
) {
  const text = await context.request.readText();
  return okResult(parseUrlEncodedFormData(text));
}
