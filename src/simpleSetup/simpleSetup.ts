import { createPipeline } from "../createPipeline/createPipeline";
import { noopMiddleware } from "../createPipeline/helpers/noopMiddleware";
import { createSchematizedEndpointFactory } from "../createSchematizedEndpointFactory/createSchematizedEndpointFactory";
import { authenticate } from "../middlewares/authenticate/authenticate";
import { checkAcceptHeader } from "../middlewares/checkAcceptHeader/checkAcceptHeader";
import { cors } from "../middlewares/cors/cors";
import { deserialize } from "../middlewares/deserialize/deserialize";
import { finalize } from "../middlewares/finalize/finalize";
import { handleValidationErrors } from "../middlewares/handleValidationErrors/handleValidationErrors";
import { logger } from "../middlewares/logger/logger";
import { serialize } from "../middlewares/serialize/serialize";
import { defaultValidationErrorHandler } from "./helpers/defaultValidationErrorHandler";
import { CreateDefaultSetupParams } from "./helpers/types";

export function simpleSetup<Session>(
  params: CreateDefaultSetupParams<Session>
) {
  return createSchematizedEndpointFactory(
    createPipeline(
      authenticate(params.getSession),
      params.cors ? cors(params.cors) : noopMiddleware(),
      params.checkAcceptHeader ? checkAcceptHeader() : noopMiddleware(),
      deserialize()
    ).split(
      handleValidationErrors(defaultValidationErrorHandler),
      serialize(),
      finalize(),
      logger({ logger: params.logger })
    )
  );
}
