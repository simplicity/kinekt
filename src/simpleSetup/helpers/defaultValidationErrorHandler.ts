import { ValidationErrors } from "../../middlewares/validatedEndpoint/helpers/types";

export const defaultValidationErrorHandler = (
  validationErrors: ValidationErrors
) => ({
  statusCode: 400 as const,
  body: validationErrors,
});
