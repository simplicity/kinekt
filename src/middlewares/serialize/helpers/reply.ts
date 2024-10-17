import type { BasePipelineContext } from "../../../createPipeline/types";
import { CheckAcceptHeaderContextExtension } from "../../checkAcceptHeader/types";
import type { SerializeContext, SerializedBody } from "../types";

export function reply(
  context: BasePipelineContext & CheckAcceptHeaderContextExtension,
  headers: Record<string, string>,
  serializedBody: SerializedBody
): SerializeContext {
  if (context.response.type === "unset") {
    return {
      ...context,
      response: {
        type: "unset",
        serializedBody: {
          type: "unset",
        },
      },
    };
  }

  return {
    ...context,
    response: {
      ...context.response,
      headers: {
        ...context.response.headers,
        ...headers,
      },
      serializedBody,
    },
  };
}
