import { z } from "npm:zod";
import type {
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
  RouteHandler,
  RouteRegistration,
} from "./types.ts";

export function registerRoute<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
>(
  routeDefinition: RouteDefinition<Path, ReqP, ReqQ, ReqB, ResB>,
  handler: RouteHandler<Path, ReqP, ReqQ, ReqB, ResB>
): RouteRegistration<Path, ReqP, ReqQ, ReqB, ResB> {
  return { routeDefinition, handler };
}
