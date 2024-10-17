import type { BasePipelineContext, Middleware } from "../createPipeline/types";
import { ValidationErrors } from "./validatedEndpoint/types";

export type WithValidationContextExtension = {
  validationErrors: ValidationErrors;
};

export const withValidation =
  <PipelineContext extends BasePipelineContext>(): Middleware<
    PipelineContext,
    PipelineContext & WithValidationContextExtension
  > =>
  async (context) => ({
    ...context,
    validationErrors: [],
  });
