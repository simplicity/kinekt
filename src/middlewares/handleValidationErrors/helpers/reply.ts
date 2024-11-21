import type { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { abort } from "../../../helpers/abort";
import type { StatusCode } from "../../../helpers/types";

export function reply(
  context: BasePipelineContext,
  handlerResult: { statusCode: StatusCode; body: unknown }
): BasePipelineContext {
  if (context.response.type === "set") {
    // TODO here we throw. In validatedEndpoint, we return. What's the right approach?
    //      and: we could directly set the error object instead of throwing
    abort("Response is already set.");
  }

  return {
    ...context,
    response: {
      type: "set",
      statusCode: handlerResult.statusCode,
      body: handlerResult.body,
      headers: {},
    },
  };
}
