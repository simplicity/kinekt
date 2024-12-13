import { ValidationErrors } from "../../middlewares/schematizedEndpoint/helpers/types";

export const defaultValidationErrorHandler = (
  validationErrors: ValidationErrors
) => ({
  statusCode: 400 as const,
  body: validationErrors,
});
