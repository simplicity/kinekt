import type { MatchFunction, ParamData } from "npm:path-to-regexp";
import type { RouteHandler } from "../createEndpoint/types.ts";

export type MatchingRoute = {
  routeHandler: RouteHandler<any, any, any, any, any, any, any, any, any>;
  params: ParamData;
};

export type CompiledRoute = {
  routeHandler: RouteHandler<any, any, any, any, any, any, any, any, any>;
  match: MatchFunction<any>;
};
