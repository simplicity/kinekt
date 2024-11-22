import {
  type BasePipelineContext,
  BasePipelineContextResponseSet,
} from "../../../createPipeline/helpers/types";
import type { DeserializeContext, DeserializedBody } from "./types";

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
    ...(response
      ? {
          response: {
            ...(context.response.type === "set" ? context.response : {}),
            ...response,
            headers: {
              ...(context.response.type === "set"
                ? context.response.headers
                : {}),
              ...response.headers,
            },
          },
        }
      : {}),
  };
}
