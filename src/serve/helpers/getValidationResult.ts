import { createValidator } from "../../createValidator/createValidator.ts";
import { parseBody } from "../../helpers/parseBody.ts";
import type { MatchingRoute } from "../types.ts";

export async function getValidationResult(
  request: Request,
  matchingRoute: MatchingRoute,
  queryString: string
) {
  const queryParams = Object.fromEntries(
    new URLSearchParams(queryString).entries()
  );

  const requestBody =
    matchingRoute.routeHandler.routeDefinition.method === "get" // TODO improve
      ? undefined
      : await parseBody(request);

  const validate = createValidator(matchingRoute.routeHandler.routeDefinition);

  return validate({
    params: matchingRoute.params,
    // TODO not great
    query: Object.values(queryParams).length === 0 ? undefined : queryParams,
    body: requestBody,
  });
}
