import { BasePipelineContext } from "../../../createPipeline/helpers/types";

export function preflightReply(
  context: BasePipelineContext,
  headers: Record<string, string>
): BasePipelineContext {
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
