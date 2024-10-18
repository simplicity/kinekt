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
  props: {
    request: ReqB;
    response: ResB;
  } & (PathParams extends void
    ? QueryParams extends void
      ? { query?: z.ZodVoid; params?: z.ZodVoid }
      : { query: ReqQ; params?: z.ZodVoid }
    : QueryParams extends void
    ? { query?: z.ZodVoid; params: ReqP }
    : { query: ReqQ; params: ReqP }),
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
      requestParamsSchema: (props.params ?? z.void()) as ReqP, // TODO correct?
      requestQuerySchema: (props.query ?? z.void()) as ReqQ,
      requestBodySchema: props.request,
      responseBodySchema: props.response,
    },
    callback
  );
}
