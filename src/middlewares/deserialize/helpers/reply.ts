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
            // TODO why do we check for "unset" here? we don't expect "set" states, and so there's no need to mix in the entire response
            ...(context.response.type !== "unset" ? context.response : {}),
            ...response,
            headers: {
              ...(context.response.type !== "unset"
                ? context.response.headers
                : {}),
              ...response.headers,
            },
          },
        }
      : {}),
  };
}
