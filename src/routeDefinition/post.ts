import { z } from "npm:zod";
import { createEndpoint } from "../createEndpoint/createEndpoint.ts";
import type { RouteHandlerCallback } from "../createRouteHandler/types.ts";
import type {
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
} from "./types.ts";

export function post<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
>(
  path: Path,
  requestParamsSchema: ReqP,
  requestQuerySchema: ReqQ,
  requestBodySchema: ReqB,
  responseBodySchema: ResB
): RouteDefinition<Path, ReqP, ReqQ, ReqB, ResB> {
  return {
    method: "post",
    path,
    requestParamsSchema,
    requestQuerySchema,
    requestBodySchema,
    responseBodySchema,
  };
}

export function post2<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
>(
  path: Path,
  requestParamsSchema: ReqP,
  requestQuerySchema: ReqQ,
  requestBodySchema: ReqB,
  responseBodySchema: ResB,
  callback: RouteHandlerCallback<Path, ReqP, ReqQ, ReqB, ResB>
) {
  return createEndpoint(
    {
      method: "post",
      path,
      requestParamsSchema,
      requestQuerySchema,
      requestBodySchema,
      responseBodySchema,
    },
    callback
  );
}
