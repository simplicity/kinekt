import type { CompiledRoute, MatchingRoute } from "../types.ts";

export function findMatchingRoute(
  compiledRouts: Array<CompiledRoute>,
  pathname: string
): MatchingRoute | null {
  return compiledRouts.reduce((acc, compiledRouteHandler) => {
    if (acc !== null) {
      return acc;
    }

    const result = compiledRouteHandler.match(pathname);

    if (result === false) {
      return acc;
    }

    return {
      routeHandler: compiledRouteHandler.routeHandler,
      params: result.params,
    };
  }, null as MatchingRoute | null);
}
