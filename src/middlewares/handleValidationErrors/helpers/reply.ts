import type { BasePipelineContext } from "../../../createPipeline/helpers/types";
import type { StatusCode } from "../../../helpers/types";

export function reply(
  context: BasePipelineContext,
  handlerResult: { statusCode: StatusCode; body: unknown }
): BasePipelineContext {
  return {
    ...context,
    response: {
      type: "set",
      statusCode: handlerResult.statusCode,
      body: handlerResult.body,
      headers:
        context.response.type === "partially-set"
          ? context.response.headers
          : {},
    },
  };
}
