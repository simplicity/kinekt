import { z } from "npm:zod";
import { createEndpoint } from "../createEndpoint/createEndpoint.ts";
import type { RouteHandlerCallback } from "../createRouteHandler/types.ts";
import type { ExtractPathParams, ExtractQueryParams } from "./types.ts";

export function get2<
  Path extends string,
  PathParams extends ExtractPathParams<Path>,
  QueryParams extends ExtractQueryParams<Path>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ResB extends z.ZodType
>(
  path: Path,
  requestParamsSchema: ReqP,
  requestQuerySchema: ReqQ,
  responseBodySchema: ResB,
  callback: RouteHandlerCallback<
    Path,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    z.ZodVoid,
    ResB
  >
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
