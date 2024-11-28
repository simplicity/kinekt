import type {
  BasePipelineContext,
  Middleware,
} from "../../createPipeline/helpers/types";
import type { StatusCode } from "../../helpers/types";
import type { WithValidationContextExtension } from "../withValidation";
import { reply } from "./helpers/reply";
import {
  HandleValidationErrorsCustomMiddlewareResponse,
  ValidationErrorHandler,
} from "./helpers/types";

export const handleValidationErrors = <
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
): Middleware<In, Out> => {
  const middleware: Middleware<In, Out> = async (context) => ({
    ...((context.validationErrors === null
      ? context
      : reply(context, handler(context.validationErrors))) as Out),
    ...({} as HandleValidationErrorsCustomMiddlewareResponse<
      ValidationErrorStatusCode,
      ValidationErrorBody
    >),
  });

  middleware.executionMode = {
    type: "bypass-when-response-is-set",
    cb: async (context) => context as any as Out,
  };

  return middleware;
};
