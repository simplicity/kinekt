import { match, ParamData } from "npm:path-to-regexp";
import { createValidator } from "./src/createValidator.ts";
import { otherRouteRegistration } from "./otherRoute.ts";
import { parseBody } from "./src/parseBody.ts";
import { RouteRegistration } from "./src/registerRoute.ts";
import { someRouteRegistration } from "./someRoute.ts";

export function server(
  routeRegistrations: Array<RouteRegistration<any, any, any, any, any>>
) {
  Deno.serve(async (request) => {
    const url = new URL(request.url);

    const result = routeRegistrations.reduce(
      (acc, routeRegistration) => {
        if (acc !== null) {
          return acc;
        }

        const result = match(
          routeRegistration.routeDefinition.path
            // TODO copy-pasted
            .replace(/\?.*$/, "")
        )(url.pathname);

        if (result === false) {
          return acc;
        }

        return { routeRegistration, params: result.params };
      },
      null as {
        routeRegistration: RouteRegistration<any, any, any, any, any>;
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
      result.routeRegistration.routeDefinition.method === "get" // TODO improve
        ? undefined
        : await parseBody(request);

    const validate = createValidator(result.routeRegistration.routeDefinition);

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

    const responseBody = await result.routeRegistration.handler(
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
