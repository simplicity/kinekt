import { BasePipelineContextResponseSet } from "../../../createPipeline/helpers/types";
import type { ValidatedEndpointContext, ValidationErrors } from "./types";

export function reply(
  context: ValidatedEndpointContext,
  response: BasePipelineContextResponseSet | null,
  validationErrors: ValidationErrors
): ValidatedEndpointContext {
  return {
    ...context,
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
    validationErrors,
  };
}
