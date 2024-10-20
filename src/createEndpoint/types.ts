import { z } from "npm:zod";
import type { BaseContext, Pipeline } from "../createPipeline/types.ts";

export type Method = "GET" | "POST";

export type EndpointDeclarationBase = `${Method} /${string}`;

type ExtractParams<Path extends string> = Path extends ""
  ? void
  : Path extends `:${infer Param}/${infer Rest}`
  ? { [K in Param | keyof ExtractParams<Rest>]: any }
  : Path extends `:${infer Param}`
  ? { [K in Param]: any }
  : Path extends `${infer _Segment}/${infer Rest}`
  ? ExtractParams<Rest>
  : void;

type ExtractQuery<Query extends string> = Query extends ""
  ? void
  : Query extends `${infer Param}&${infer Rest}`
  ? { [K in Param | keyof ExtractQuery<Rest>]: any }
  : Query extends `${infer Param}`
  ? { [K in Param]: any }
  : void;

type SplitPathAndQuery<Url extends EndpointDeclarationBase> =
  Url extends `${infer MethodI extends Method} ${infer Path}?${infer Query}`
    ? [MethodI, Path, Query]
    : Url extends `${infer MethodI extends Method} ${infer Path}`
    ? [MethodI, Path, string]
    : never;

export type ExtractMethod<Url extends EndpointDeclarationBase> =
  SplitPathAndQuery<Url>[0];

export type ExtractPathParams<Url extends EndpointDeclarationBase> =
  ExtractParams<SplitPathAndQuery<Url>[1]>;

export type ExtractQueryParams<Url extends EndpointDeclarationBase> =
  ExtractQuery<SplitPathAndQuery<Url>[2]>;

type RouteDefinitionDefaults<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ResB extends z.ZodType
> = {
  path: EndpointDeclaration;
  requestParamsSchema: ReqP;
  requestQuerySchema: ReqQ;
  responseBodySchema: ResB;
};

export type RouteDefinition<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
> =
  | ({
      method: "GET";
    } & RouteDefinitionDefaults<
      EndpointDeclaration,
      PathParams,
      QueryParams,
      ReqP,
      ReqQ,
      ResB
    >)
  | ({
      method: "POST";
      requestBodySchema: ReqB;
    } & RouteDefinitionDefaults<
      EndpointDeclaration,
      PathParams,
      QueryParams,
      ReqP,
      ReqQ,
      ResB
    >);

export type RouteHandlerCallback<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType,
  Context extends BaseContext
> = (params: {
  params: z.infer<ReqP>;
  query: z.infer<ReqQ>;
  body: z.infer<ReqB>;
  context: Context;
}) => Promise<z.infer<ResB>>;

export type RouteHandler<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType,
  Context extends BaseContext
> = {
  routeDefinition: RouteDefinition<
    EndpointDeclaration,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >;
  callback: RouteHandlerCallback<
    EndpointDeclaration,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB,
    Context
  >;
  pipeline: Pipeline<Context>;
};

export type Endpoint<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType,
  Context extends BaseContext
> = {
  (props: {
    path: z.infer<ReqP>;
    query: z.infer<ReqQ>;
    body: z.infer<ReqB>;
  }): Promise<z.infer<ResB>>;
  routeHandler: RouteHandler<
    EndpointDeclaration,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB,
    Context
  >;
};
