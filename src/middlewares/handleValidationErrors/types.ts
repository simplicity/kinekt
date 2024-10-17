import { StatusCode } from "../../types";
import { ValidationErrors } from "../validatedEndpoint/types";

export type HandleValidationErrorsCustomMiddlewareResponse<
  ValidationErrorStatusCode extends StatusCode,
  ValidationErrorBody
> = {
  handleValidationErrorsCustomMiddlewareResponse: {
    statusCode: ValidationErrorStatusCode;
    body: ValidationErrorBody;
  };
};

export type ValidationErrorHandler<
  ValidationErrorStatusCode extends StatusCode,
  ValidationErrorBody
> = (validationErrors: ValidationErrors) => {
  statusCode: ValidationErrorStatusCode;
  body: ValidationErrorBody;
};
