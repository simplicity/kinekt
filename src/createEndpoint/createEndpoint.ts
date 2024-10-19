import { z } from "npm:zod";
import { createClient } from "../createClient/createClient.ts";
import type {
  Endpoint,
  ExtractMethod,
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
  RouteHandlerCallback,
} from "./types.ts";

function createEndpointInternal<
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
): Endpoint<Path, PathParams, QueryParams, ReqP, ReqQ, ReqB, ResB> {
  const client = createClient(routeDefinition) as Endpoint<
    Path,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >;

  client.routeHandler = { routeDefinition, callback };

  return client;
}

export function createEndpoint<
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
      return createEndpointInternal(
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
      return createEndpointInternal(
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
