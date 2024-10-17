import { BasePipelineContextResponseSet } from "../../../createPipeline/types";
import type { ValidatedEndpointContext, ValidationErrors } from "../types";

export function reply(
  context: ValidatedEndpointContext,
  response: BasePipelineContextResponseSet | null,
  validationErrors: ValidationErrors
): ValidatedEndpointContext {
  return {
    ...context,
    // TODO here we have to make sure that headers will be merged ...? -> there's other places
    ...(response ? { response } : {}),
    validationErrors,
  };
}
