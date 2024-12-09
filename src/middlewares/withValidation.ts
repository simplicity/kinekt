import type {
  BasePipelineContext,
  Middleware,
} from "../createPipeline/helpers/types";
import { ValidationErrors } from "./validatedEndpoint/helpers/types";

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
