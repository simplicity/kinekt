import { z } from "npm:zod";
import type {
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
} from "../types.ts";
import type { RouteHandler, RouteHandlerCallback } from "./types.ts";

export function createRouteHandler<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
>(
  routeDefinition: RouteDefinition<Path, ReqP, ReqQ, ReqB, ResB>,
  callback: RouteHandlerCallback<Path, ReqP, ReqQ, ReqB, ResB>
): RouteHandler<Path, ReqP, ReqQ, ReqB, ResB> {
  return { routeDefinition, callback };
}
