import type { Method } from "./types";

export type RouteMatchMatcher = { method: Method | "ANY"; path: string };

export type RouteMatchMetadata = {
  type: "route-match-metadata";
  matchers: Array<RouteMatchMatcher>;
};

export function isRouteMatchMetadata(
  metadata: unknown
): metadata is RouteMatchMetadata {
  return (metadata as RouteMatchMetadata)?.type === "route-match-metadata";
}

export function routeMatchMetadata(
  matchers: Array<RouteMatchMatcher>
): RouteMatchMetadata {
  return {
    type: "route-match-metadata",
    matchers,
  };
}
