import { z, ZodVoid } from "npm:zod";
import type {
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
} from "./types.ts";

export function get<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ResB extends z.ZodType
>(
  path: Path,
  requestParamsSchema: ReqP,
  requestQuerySchema: ReqQ,
  responseBodySchema: ResB
): RouteDefinition<Path, ReqP, ReqQ, ZodVoid, ResB> {
  return {
    method: "get",
    path,
    requestParamsSchema,
    requestQuerySchema,
    responseBodySchema,
  };
}
