import { BasePipelineContext } from "../../../createPipeline/helpers/types";

export function reply(
  context: BasePipelineContext,
  headers: Record<string, string>
): BasePipelineContext {
  return {
    ...context,
    response: {
      type: "set",
      statusCode: 200,
      body: null,
      ...(context.response.type === "set" ? context.response : {}),
      headers: {
        ...(context.response.type === "set" ? context.response.headers : {}),
        ...headers,
      },
    },
  };
}
