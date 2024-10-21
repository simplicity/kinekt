import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";
import { match } from "npm:path-to-regexp";
import type {
  Endpoint,
  ValidationErrorStatusCode,
} from "../createEndpoint/types.ts";
import { removeMethod } from "../helpers/removeMethod.ts";
import { removeQuery } from "../helpers/removeQuery.ts";
import { findMatchingRoute } from "./helpers/findMatchingRoute.ts";
import { getValidationResult } from "./helpers/getValidationResult.ts";
import type { CompiledRoute } from "./types.ts";

const logger = new Logger();

export function serve(
  endpoints: Array<Endpoint<any, any, any, any, any, any, any, any, any>>
) {
  const compiledRoute: Array<CompiledRoute> = endpoints.map((endpoint) => ({
    routeHandler: endpoint.routeHandler,
    match: match(
      removeQuery(
        removeMethod(endpoint.routeHandler.routeDefinition.endpointDeclaration)
      )
    ),
  }));

  Deno.serve(async (request) => {
    const url = new URL(request.url);

    logger.info(`serving ${url}`);

    const matchingRoute = findMatchingRoute(compiledRoute, url.pathname);

    // TODO lint? (strict-boolean-expressions)
    if (matchingRoute === null) {
      logger.info(`Unable to serve ${url}`);

      return new Response(JSON.stringify({ message: "NOT FOUND" }), {
        status: 404,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }

    // TODO what about middleware that should run independently of the route?
    const context = await matchingRoute.routeHandler.pipeline({
      request: { method: "GET", url: "lksjdf" },
      halted: false,
      response: { body: {}, code: 200 },
    });

    const validationResult = await getValidationResult(
      request,
      matchingRoute,
      url.search
    );

    if (validationResult.type === "error") {
      return new Response(JSON.stringify(validationResult.validationErrors), {
        status: 400 as ValidationErrorStatusCode,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }

    const response = await matchingRoute.routeHandler.callback({
      params: validationResult.value.parsedParams,
      query: validationResult.value.parsedQuery,
      body: validationResult.value.parsedBody,
      context,
    });

    return new Response(JSON.stringify(response.body), {
      status: response.code,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  });
}
