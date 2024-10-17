import { HandleRequestResult } from "../../createRequestHandler/helpers/handleRequest/handleRequest";
import { isFinalized } from "../../middlewares/finalize/helpers/isFinalized";
import { Logger, StatusCode } from "../../types";

export type CreateResponse<T, Arg = void> = (
  body: unknown,
  statusCode: StatusCode,
  headers: Record<string, string> | undefined,
  arg: Arg
) => T;

export function postProcess<T, Arg>(
  result: HandleRequestResult,
  createResponse: CreateResponse<T, Arg>,
  arg: Arg,
  logger: Logger
) {
  if (result.type === "error") {
    switch (result.code) {
      case "no-route-found": {
        logger.error("No route found to serve request.");
        return createResponse(null, 500, undefined, arg);
      }
    }
  }

  if (result.value.error.type === "error") {
    logger.error(result.value.error.error);
  }

  if (!isFinalized(result.value)) {
    logger.error("Pipeline was not finalized.");
    return createResponse(null, 500, undefined, arg);
  }

  return createResponse(
    result.value.finalizedResponse.body,
    result.value.finalizedResponse.statusCode,
    result.value.finalizedResponse.headers,
    arg
  );
}
