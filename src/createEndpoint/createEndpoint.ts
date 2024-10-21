import { z } from "npm:zod";
import type { BasePipelineContext, Pipeline } from "../createPipeline/types.ts";
import { createClient } from "./helpers/createClient.ts";
import type {
  CreateEndpointProps,
  Endpoint,
  EndpointDeclarationBase,
  ExtractMethod,
  ExtractPathParams,
  ExtractQueryParams,
  Method,
  RouteDefinition,
  RouteHandlerCallback,
  StatusCode,
} from "./types.ts";

const validMethods: Array<Method> = ["GET", "POST", "PUT", "PATCH", "DELETE"];

function isMethod(method: string | undefined): method is Method {
  return validMethods.includes(method as Method);
}

function extractMethod(endpointDeclaration: string): Method | undefined {
  const method = endpointDeclaration.split(" ").at(0);

  return isMethod(method) ? method : undefined;
}

function createEndpointInternal<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends { [key: number]: z.ZodType },
  ResC extends keyof ResB & StatusCode,
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
    ResC,
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
  ResC,
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
    ResC,
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
  ResB extends { [key: number]: z.ZodType },
  ResC extends keyof ResB & StatusCode,
  PipelineContext extends BasePipelineContext
>(
  pipeline: Pipeline<PipelineContext>,
  endpointDeclaration: EndpointDeclaration,
  props: CreateEndpointProps<
    EndpointDeclaration,
    Method,
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
    ResC,
    PipelineContext
  >
): Endpoint<
  EndpointDeclaration,
  PathParams,
  QueryParams,
  ReqP,
  ReqQ,
  ReqB,
  ResB,
  ResC,
  PipelineContext
> {
  const method = extractMethod(endpointDeclaration);

  switch (method) {
    case "GET": {
      return createEndpointInternal(
        {
          method: "GET",
          endpointDeclaration,
          requestParamsSchema: (props.params ?? z.void()) as ReqP,
          requestQuerySchema: (props.query ?? z.void()) as ReqQ,
          responseBodySchema: props.response,
        },
        callback,
        pipeline
      );
    }
    case "POST":
    case "PUT":
    case "PATCH":
    case "DELETE": {
      return createEndpointInternal(
        {
          method: "POST",
          endpointDeclaration,
          requestParamsSchema: (props.params ?? z.void()) as ReqP,
          requestQuerySchema: (props.query ?? z.void()) as ReqQ,
          requestBodySchema: (props.request ?? z.void()) as ReqB,
          responseBodySchema: props.response,
        },
        callback,
        pipeline
      );
    }
    case undefined: {
      // TODO here we do throw an error
      throw new Error(
        `Invalid method ${method} in endpoint declaration ${endpointDeclaration}`
      );
    }
  }
}
