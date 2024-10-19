import { match, ParamData } from "npm:path-to-regexp";
import { getUser } from "./endpoints/users/getUser.ts";
import { createValidator } from "./src/createValidator/createValidator.ts";
import { parseBody } from "./src/helpers/parseBody.ts";
import { removeQuery } from "./src/helpers/removeQuery.ts";

import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";
import { createUser } from "./endpoints/users/getUser.ts";
import type { RouteHandler } from "./src/createEndpoint/types.ts";

const logger = new Logger();

type MatchingRoute = {
  routeHandler: RouteHandler<any, any, any, any, any, any, any>;
  params: ParamData;
};

function findMatchingRoute(
  routeHandlers: Array<RouteHandler<any, any, any, any, any, any, any>>,
  pathname: string
): MatchingRoute | null {
  return routeHandlers.reduce((acc, routeHandler) => {
    if (acc !== null) {
      return acc;
    }

    const result = match(removeQuery(routeHandler.routeDefinition.path))(
      pathname
    );

    if (result === false) {
      return acc;
    }

    return { routeHandler, params: result.params };
  }, null as MatchingRoute | null);
}

async function getValidationResult(
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

export function server(
  routeHandlers: Array<RouteHandler<any, any, any, any, any, any, any>>
) {
  Deno.serve(async (request) => {
    const url = new URL(request.url);

    logger.info(`serving ${url}`);

    const matchingRoute = findMatchingRoute(routeHandlers, url.pathname);

    // TODO lint?
    if (matchingRoute === null) {
      logger.info(`Unable to serve ${url}`);

      return new Response(JSON.stringify({ message: "NOT FOUND" }), {
        status: 404,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }

    const validationResult = await getValidationResult(
      request,
      matchingRoute,
      url.search
    );

    if (validationResult.type === "error") {
      return new Response(JSON.stringify(validationResult.error), {
        status: 403,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }

    const responseBody = await matchingRoute.routeHandler.callback({
      params: validationResult.value.parsedParams,
      query: validationResult.value.parsedQuery,
      body: validationResult.value.parsedBody,
    });

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  });
}

server([getUser.routeHandler, createUser.routeHandler]);
