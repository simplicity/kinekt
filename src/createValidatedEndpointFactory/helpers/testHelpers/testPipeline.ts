import { createPipeline } from "../../../createPipeline/createPipeline";
import { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { authenticate } from "../../../middlewares/authenticate/authenticate";
import { AuthenticateCallbackResult } from "../../../middlewares/authenticate/helpers/types";
import { checkAcceptHeader } from "../../../middlewares/checkAcceptHeader/checkAcceptHeader";
import { cors } from "../../../middlewares/cors/cors";
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

export type TestSession = { user: { email: string } };

async function getSession<In extends BasePipelineContext>(
  context: In
): Promise<AuthenticateCallbackResult<TestSession>> {
  const authorization = context.request.getHeader("authorization");

  return authorization === null
    ? { type: "unset" }
    : { type: "set", session: { user: { email: atob(authorization) } } };
}

export const testPipeline = createValidatedEndpointFactory(
  createPipeline(
    cors({ origins: ["http://example.com"] }),
    checkAcceptHeader(),
    deserialize(),
    authenticate(getSession),
    withValidation()
  ).split(
    handleValidationErrors(defaultValidationErrorHandler),
    serialize(),
    finalize()
  )
);

testPipeline.setGlobalClientParams({ baseUrl: "https://some-test-domain.ch" });
