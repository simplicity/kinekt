import { BasePipelineContext } from "../../../createPipeline/helpers/types";

export function actualReply(
  context: BasePipelineContext,
  headers: Record<string, string>
): BasePipelineContext {
  return {
    ...context,
    response: {
      type: "partially-set",
      headers: {
        ...(context.response.type !== "unset" ? context.response.headers : {}),
        ...headers,
      },
    },
  };
}
