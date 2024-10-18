import { z, ZodVoid } from "npm:zod";
import { createEndpoint } from "../createEndpoint/createEndpoint.ts";
import type { RouteHandlerCallback } from "../createRouteHandler/types.ts";
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

export function get2<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ResB extends z.ZodType
>(
  path: Path,
  requestParamsSchema: ReqP,
  requestQuerySchema: ReqQ,
  responseBodySchema: ResB,
  callback: RouteHandlerCallback<Path, ReqP, ReqQ, z.ZodVoid, ResB>
) {
  return createEndpoint(
    {
      method: "get",
      path,
      requestParamsSchema,
      requestQuerySchema,
      responseBodySchema,
    },
    callback
  );
}
