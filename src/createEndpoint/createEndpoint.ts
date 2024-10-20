import { z } from "npm:zod";
import type { BasePipelineContext, Pipeline } from "../createPipeline/types.ts";
import { createClient } from "./createClient/createClient.ts";
import type {
  Endpoint,
  EndpointDeclarationBase,
  ExtractMethod,
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
  RouteHandlerCallback,
} from "./types.ts";

function createEndpointInternal<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType,
  PipelineContext extends BasePipelineContext
>(
  routeDefinition: RouteDefinition<
    EndpointDeclaration,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >,
  callback: RouteHandlerCallback<
    EndpointDeclaration,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB,
    PipelineContext
  >,
  pipeline: Pipeline<PipelineContext>
): Endpoint<
  EndpointDeclaration,
  PathParams,
  QueryParams,
  ReqP,
  ReqQ,
  ReqB,
  ResB,
  PipelineContext
> {
  const client = createClient(routeDefinition) as Endpoint<
    EndpointDeclaration,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB,
    PipelineContext
  >;

  client.routeHandler = { routeDefinition, callback, pipeline };

  return client;
}

export function createEndpoint<
  EndpointDeclaration extends EndpointDeclarationBase,
  Method extends ExtractMethod<EndpointDeclaration>,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType,
  PipelineContext extends BasePipelineContext
>(
  pipeline: Pipeline<PipelineContext>,
  endpointDeclaration: EndpointDeclaration,
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
    EndpointDeclaration,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB,
    PipelineContext
  >
) {
  const parts = endpointDeclaration.split(" ");

  const method = parts.at(0);

  // TODO naming
  // TODO what if it is empty?
  const actualPath = (parts.at(1) ?? "") as EndpointDeclaration;

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
