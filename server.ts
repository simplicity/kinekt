import { match, ParamData } from "npm:path-to-regexp";
import { otherRouteRegistration } from "./otherRoute.ts";
import { someRouteRegistration } from "./someRoute.ts";
import type { RouteHandler } from "./src/createRouteHandler/types.ts";
import { createValidator } from "./src/createValidator/createValidator.ts";
import { parseBody } from "./src/helpers/parseBody.ts";

export function server(
  routeHandlers: Array<RouteHandler<any, any, any, any, any>>
) {
  Deno.serve(async (request) => {
    const url = new URL(request.url);

    const result = routeHandlers.reduce(
      (acc, routeHandler) => {
        if (acc !== null) {
          return acc;
        }

        const result = match(
          routeHandler.routeDefinition.path
            // TODO copy-pasted
            .replace(/\?.*$/, "")
        )(url.pathname);

        if (result === false) {
          return acc;
        }

        return { routeHandler, params: result.params };
      },
      null as {
        routeHandler: RouteHandler<any, any, any, any, any>;
        params: ParamData;
      } | null
    );

    // TODO lint?
    if (result === null) {
      return new Response(JSON.stringify({ message: "NOT FOUND" }), {
        status: 404,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }

    const queryParams = Object.fromEntries(
      new URLSearchParams(url.search).entries()
    );

    const requestBody =
      result.routeHandler.routeDefinition.method === "get" // TODO improve
        ? undefined
        : await parseBody(request);

    const validate = createValidator(result.routeHandler.routeDefinition);

    const validationResult = validate({
      params: result.params,
      query: queryParams,
      body: requestBody,
    });

    if (validationResult.type === "error") {
      return new Response(JSON.stringify(validationResult.error), {
        status: 403,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }

    const responseBody = await result.routeHandler.callback(
      validationResult.value.parsedParams,
      validationResult.value.parsedQuery,
      validationResult.value.parsedBody
    );

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  });
}

server([someRouteRegistration, otherRouteRegistration]);
