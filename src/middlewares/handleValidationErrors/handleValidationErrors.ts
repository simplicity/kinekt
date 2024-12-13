import type {
  BasePipelineContext,
  Middleware,
} from "../../createPipeline/helpers/types";
import type { StatusCode } from "../../helpers/types";
import { ValidatedEndpointContextExtension } from "../validatedEndpoint/helpers/types";
import { reply } from "./helpers/reply";
import {
  HandleValidationErrorsCustomMiddlewareResponse,
  ValidationErrorHandler,
} from "./helpers/types";

export const handleValidationErrors =
  <
    In extends BasePipelineContext & ValidatedEndpointContextExtension,
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
    ...((context.validationErrors === null || context.response.type === "set"
      ? context
      : reply(context, handler(context.validationErrors ?? []))) as Out),
    ...({} as HandleValidationErrorsCustomMiddlewareResponse<
      ValidationErrorStatusCode,
      ValidationErrorBody
    >),
  });
