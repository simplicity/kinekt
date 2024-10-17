import {
  type BasePipelineContext,
  BasePipelineContextResponseSet,
} from "../../../createPipeline/types";
import type { DeserializeContext, DeserializedBody } from "../types";

export function reply(
  context: BasePipelineContext,
  response: BasePipelineContextResponseSet | null,
  deserializedBody: DeserializedBody
): DeserializeContext {
  return {
    ...context,
    request: {
      ...context.request,
      deserializedBody,
    },
    ...(response ? { response } : {}),
  };
}
