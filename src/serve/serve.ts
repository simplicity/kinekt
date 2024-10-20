import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";
import type { Endpoint } from "../createEndpoint/types.ts";
import { findMatchingRoute } from "./helpers/findMatchingRoute.ts";
import { getValidationResult } from "./helpers/getValidationResult.ts";

const logger = new Logger();

export function serve(
  endpoints: Array<Endpoint<any, any, any, any, any, any, any, any>>
) {
  const routeHandlers = endpoints.map((endpoint) => endpoint.routeHandler);

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
      context,
    });

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  });
}
