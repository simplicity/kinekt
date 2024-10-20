import type { ParamData } from "npm:path-to-regexp";
import type { RouteHandler } from "../createEndpoint/types.ts";

export type MatchingRoute = {
  routeHandler: RouteHandler<any, any, any, any, any, any, any, any, any>;
  params: ParamData;
};
