import type { ParamData } from "npm:path-to-regexp";
import { match } from "npm:path-to-regexp";
import { otherRouteRegistration } from "./otherRoute.ts";
import type { RouteRegistration } from "./registerRoute.ts";
import { someRouteRegistration } from "./someRoute.ts";

export function server(
  routeRegistrations: Array<RouteRegistration<any, any, any, any, any>>
) {
  Deno.serve(async (req) => {
    const url = req.url
      .replace("http://localhost:8000", "")
      .replace(/\?.*$/, ""); // TODO needed?

    console.log("HERE", url);

    const result = routeRegistrations.reduce(
      (acc, routeRegistration) => {
        if (acc !== null) {
          return acc;
        }

        const result = match(
          routeRegistration.routeDefinition.path
            // TODO copy-pasted
            .replace(/\?.*$/, "")
        )(url);

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
      const body = JSON.stringify({ message: "NOT FOUND" });

      return new Response(body, {
        status: 404,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }

    const responseBody = await result.routeRegistration.handler(
      result.params,
      null,
      null
    );

    const body = JSON.stringify(responseBody);

    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  });
}

server([someRouteRegistration, otherRouteRegistration]);
