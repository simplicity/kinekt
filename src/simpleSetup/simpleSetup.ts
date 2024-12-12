import { createPipeline } from "../createPipeline/createPipeline";
import { noopMw } from "../createPipeline/helpers/noopMiddleware";
import { createValidatedEndpointFactory } from "../createValidatedEndpointFactory/createValidatedEndpointFactory";
import { authenticate } from "../middlewares/authenticate/authenticate";
import { checkAcceptHeader } from "../middlewares/checkAcceptHeader/checkAcceptHeader";
import { cors } from "../middlewares/cors/cors";
import { deserialize } from "../middlewares/deserialize/deserialize";
import { finalize } from "../middlewares/finalize/finalize";
import { handleValidationErrors } from "../middlewares/handleValidationErrors/handleValidationErrors";
import { serialize } from "../middlewares/serialize/serialize";
import { withValidation } from "../middlewares/withValidation";
import { defaultValidationErrorHandler } from "./helpers/defaultValidationErrorHandler";
import { CreateDefaultSetupParams } from "./helpers/types";

export function simpleSetup<Session>(
  params: CreateDefaultSetupParams<Session>
) {
  return createValidatedEndpointFactory(
    createPipeline(
      params.cors ? cors(params.cors) : noopMw,
      params.checkAcceptHeader ? checkAcceptHeader() : noopMw,
      deserialize(),
      authenticate(params.getSession),
      withValidation()
    ).split(
      handleValidationErrors(defaultValidationErrorHandler),
      serialize(),
      finalize()
    )
  );
}
