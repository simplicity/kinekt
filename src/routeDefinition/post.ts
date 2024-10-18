import { z } from "npm:zod";
import { createEndpoint } from "../createEndpoint/createEndpoint.ts";
import type { RouteHandlerCallback } from "../createRouteHandler/types.ts";
import type { ExtractPathParams, ExtractQueryParams } from "./types.ts";

export function post2<
  Path extends string,
  PathParams extends ExtractPathParams<Path>,
  QueryParams extends ExtractQueryParams<Path>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
>(
  path: Path,
  // p: (PathParams extends void ? Empty1 : { params: ReqP }) &
  //   (QueryParams extends void ? Empty2 : { query: ReqQ }),
  // p: {
  //   params: PathParams extends void ? void : ReqP;
  //   query: QueryParams extends void ? void : ReqQ;
  // },
  p: PathParams extends void
    ? QueryParams extends void
      ? { query?: z.ZodVoid; params?: z.ZodVoid }
      : { query: ReqQ; params?: z.ZodVoid }
    : QueryParams extends void
    ? { query?: z.ZodVoid; params: ReqP }
    : { query: ReqQ; params: ReqP },
  requestBodySchema: ReqB,
  responseBodySchema: ResB,
  callback: RouteHandlerCallback<
    Path,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >
) {
  return createEndpoint(
    {
      method: "post",
      path,
      requestParamsSchema: (p.params ?? z.void()) as ReqP,
      requestQuerySchema: (p.query ?? z.void()) as ReqQ,
      requestBodySchema,
      responseBodySchema,
    },
    callback
  );
}
