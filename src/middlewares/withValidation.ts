import type {
  BasePipelineContext,
  Middleware,
} from "../createPipeline/helpers/types";
import { ValidationErrors } from "./validatedEndpoint/helpers/types";

export type WithValidationContextExtension = {
  validationErrors: ValidationErrors;
};

// TODO We could use this middleware to control whether validation should happen or not.
//      The schema definition with zod we need in any case.
export const withValidation =
  <PipelineContext extends BasePipelineContext>(): Middleware<
    PipelineContext,
    PipelineContext & WithValidationContextExtension
  > =>
  async (context) => ({
    ...context,
    validationErrors: [],
  });
