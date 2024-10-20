import { z } from "npm:zod";
import type { BaseContext, Pipeline } from "../createPipeline/types.ts";
import { createClient } from "./createClient/createClient.ts";
import type {
  Endpoint,
  ExtractMethod,
  ExtractPathParams,
  ExtractQueryParams,
  PathBase,
  RouteDefinition,
  RouteHandlerCallback,
} from "./types.ts";

function createEndpointInternal<
  Path extends PathBase,
  PathParams extends ExtractPathParams<Path>,
  QueryParams extends ExtractQueryParams<Path>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType,
  Context extends BaseContext
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
    ResB,
    Context
  >,
  pipeline: Pipeline<Context>
): Endpoint<Path, PathParams, QueryParams, ReqP, ReqQ, ReqB, ResB, Context> {
  const client = createClient(routeDefinition) as Endpoint<
    Path,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB,
    Context
  >;

  client.routeHandler = { routeDefinition, callback, pipeline };

  return client;
}

export function createEndpoint<
  Path extends PathBase,
  Method extends ExtractMethod<Path>,
  PathParams extends ExtractPathParams<Path>,
  QueryParams extends ExtractQueryParams<Path>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType,
  // TODO naming
  Context extends BaseContext
>(
  pipeline: Pipeline<Context>,
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
    ResB,
    Context
  >
) {
  const parts = path.split(" ");

  const method = parts.at(0);

  // TODO naming
  // TODO what if it is empty?
  const actualPath = (parts.at(1) ?? "") as Path;

  switch (method) {
    case "GET": {
      return createEndpointInternal(
        {
          method: "GET",
          path: actualPath,
          requestParamsSchema: (props.params ?? z.void()) as ReqP, // TODO correct?
          requestQuerySchema: (props.query ?? z.void()) as ReqQ,
          responseBodySchema: props.response,
        },
        callback,
        pipeline
      );
    }
    case "POST": {
      return createEndpointInternal(
        {
          method: "POST",
          path: actualPath,
          requestParamsSchema: (props.params ?? z.void()) as ReqP, // TODO correct?
          requestQuerySchema: (props.query ?? z.void()) as ReqQ,
          requestBodySchema: (props.request ?? z.void()) as ReqB,
          responseBodySchema: props.response,
        },
        callback,
        pipeline
      );
    }
  }

  // TODO don't throw?
  throw new Error(`Unknown method ${method}`);
}
