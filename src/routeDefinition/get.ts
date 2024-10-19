import { z } from "npm:zod";
import { createEndpoint } from "../createEndpoint/createEndpoint.ts";
import type { RouteHandlerCallback } from "../createEndpoint/types.ts";
import type {
  ExtractMethod,
  ExtractPathParams,
  ExtractQueryParams,
} from "./types.ts";

export function get2<
  Path extends string,
  Method extends ExtractMethod<Path>,
  PathParams extends ExtractPathParams<Path>,
  QueryParams extends ExtractQueryParams<Path>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
>(
  // TODO not really "path" anymore, because it contains the method
  path: Path,
  props: {
    response: ResB;
  } & (Method extends "POST" ? { request: ReqB } : { request?: void }) &
    (PathParams extends void
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
  const parts = path.split(" ");

  const method = parts.at(0)?.toLowerCase();

  // TODO naming
  // TODO what if it is empty?
  const actualPath = (parts.at(1) ?? "") as Path;

  switch (method) {
    case "get": {
      return createEndpoint(
        {
          method: "get",
          path: actualPath,
          requestParamsSchema: (props.params ?? z.void()) as ReqP, // TODO correct?
          requestQuerySchema: (props.query ?? z.void()) as ReqQ,
          responseBodySchema: props.response,
        },
        callback
      );
    }
    case "post": {
      return createEndpoint(
        {
          method: "post",
          path: actualPath,
          requestParamsSchema: (props.params ?? z.void()) as ReqP, // TODO correct?
          requestQuerySchema: (props.query ?? z.void()) as ReqQ,
          requestBodySchema: (props.request ?? z.void()) as ReqB,
          responseBodySchema: props.response,
        },
        callback
      );
    }
  }

  // TODO don't throw?
  throw new Error(`Unknown method ${method}`);
}
