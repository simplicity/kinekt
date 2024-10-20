import { match } from "npm:path-to-regexp";
import type { RouteHandler } from "../../createEndpoint/types.ts";
import { removeQuery } from "../../helpers/removeQuery.ts";
import type { MatchingRoute } from "../types.ts";

export function findMatchingRoute(
  routeHandlers: Array<RouteHandler<any, any, any, any, any, any, any, any>>,
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
