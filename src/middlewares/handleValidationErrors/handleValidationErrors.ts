import type {
  BasePipelineContext,
  Middleware,
} from "../../createPipeline/types";
import type { StatusCode } from "../../types";
import type { WithValidationContextExtension } from "../withValidation";
import { reply } from "./helpers/reply";
import {
  HandleValidationErrorsCustomMiddlewareResponse,
  ValidationErrorHandler,
} from "./types";

export const handleValidationErrors =
  <
    In extends BasePipelineContext & WithValidationContextExtension,
    Out extends In &
      HandleValidationErrorsCustomMiddlewareResponse<
        ValidationErrorStatusCode,
        ValidationErrorBody
      >,
    ValidationErrorStatusCode extends StatusCode,
    ValidationErrorBody
  >(
    handler: ValidationErrorHandler<
      ValidationErrorStatusCode,
      ValidationErrorBody
    >
  ): Middleware<In, Out> =>
  async (context) => ({
    ...((context.validationErrors === null
      ? context
      : reply(context, handler(context.validationErrors))) as Out),
    ...({} as HandleValidationErrorsCustomMiddlewareResponse<
      ValidationErrorStatusCode,
      ValidationErrorBody
    >),
  });
