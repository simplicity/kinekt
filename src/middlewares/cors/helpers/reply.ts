import { BasePipelineContext } from "../../../createPipeline/helpers/types";

export function reply(
  context: BasePipelineContext,
  headers: Record<string, string>,
  isPreflight: boolean
): BasePipelineContext {
  if (isPreflight) {
    return {
      ...context,
      response: {
        type: "set",
        statusCode: 200,
        body: null,
        headers,
      },
    };
  }

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
