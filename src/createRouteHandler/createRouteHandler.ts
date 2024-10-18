import { z } from "npm:zod";
import type {
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
} from "../routeDefinition/types.ts";
import type { RouteHandler, RouteHandlerCallback } from "./types.ts";

export function createRouteHandler<
  Path extends string,
  PathParams extends ExtractPathParams<Path>,
  QueryParams extends ExtractQueryParams<Path>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
>(
  routeDefinition: RouteDefinition<
    Path,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >,
  callback: RouteHandlerCallback<
    Path,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >
): RouteHandler<Path, PathParams, QueryParams, ReqP, ReqQ, ReqB, ResB> {
  return { routeDefinition, callback };
}
