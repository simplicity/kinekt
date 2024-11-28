import { createPipeline } from "../../../createPipeline/createPipeline";
import { authenticate } from "../../../middlewares/authenticate/authenticate";
import { checkAcceptHeader } from "../../../middlewares/checkAcceptHeader/checkAcceptHeader";
import { deserialize } from "../../../middlewares/deserialize/deserialize";
import { finalize } from "../../../middlewares/finalize/finalize";
import { handleValidationErrors } from "../../../middlewares/handleValidationErrors/handleValidationErrors";
import { serialize } from "../../../middlewares/serialize/serialize";
import { ValidationErrors } from "../../../middlewares/validatedEndpoint/helpers/types";
import { withValidation } from "../../../middlewares/withValidation";
import { createValidatedEndpointFactory } from "../../createValidatedEndpointFactory";

const defaultValidationErrorHandler = (validationErrors: ValidationErrors) => ({
  statusCode: 400 as const,
  body: validationErrors,
});

// TODO add integration tests for cors mw

export const testPipeline = createValidatedEndpointFactory(
  createPipeline(
    checkAcceptHeader(),
    deserialize(),
    authenticate(),
    withValidation()
  ).split(
    handleValidationErrors(defaultValidationErrorHandler),
    serialize(),
    finalize()
  )
);

testPipeline.setGlobalClientParams({ baseUrl: "https://some-test-domain.ch" });
