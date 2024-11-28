import { HandleRequestResult } from "../../createRequestHandler/helpers/handleRequest/handleRequest";
import { Logger, StatusCode } from "../../helpers/types";
import { isFinalized } from "../../middlewares/finalize/helpers/isFinalized";

export type CreateResponse<T, Arg = void> = (
  body: unknown,
  statusCode: StatusCode,
  headers: Record<string, string> | undefined,
  arg: Arg
) => T;

const noRouteFoundError = "No route found to serve request.";
const notFinalizedError = "Pipeline was not finalized.";

export function postProcess<T, Arg>(
  result: HandleRequestResult,
  createResponse: CreateResponse<T, Arg>,
  arg: Arg,
  logger: Logger
) {
  if (result.type === "error") {
    switch (result.code) {
      case "no-route-found": {
        logger.error(noRouteFoundError);
        return createResponse(noRouteFoundError, 500, undefined, arg);
      }
    }
  }

  if (result.value.error.type === "error") {
    logger.error(result.value.error.error);
  }

  if (!isFinalized(result.value)) {
    logger.error(notFinalizedError);
    return createResponse(notFinalizedError, 500, undefined, arg);
  }

  return createResponse(
    result.value.finalizedResponse.body,
    result.value.finalizedResponse.statusCode,
    result.value.finalizedResponse.headers,
    arg
  );
}
