import { z, type ZodIssue } from "npm:zod";
import type { BasePipelineContext, Pipeline } from "../createPipeline/types.ts";

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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

export type StatusCode = 200 | 401 | 422;

type RouteDefinitionDefaults<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ResB extends { [key: number]: z.ZodType }
> = {
  endpointDeclaration: EndpointDeclaration;
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
  ResB extends { [key: number]: z.ZodType }
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
      method: "POST" | "PUT" | "PATCH" | "DELETE";
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
  ResB extends { [key: number]: z.ZodType },
  ResC extends keyof ResB & StatusCode,
  PipelineContext extends BasePipelineContext
> = (params: {
  params: z.infer<ReqP>;
  query: z.infer<ReqQ>;
  body: z.infer<ReqB>;
  context: PipelineContext;
}) => Promise<
  {
    [Code in ResC]: { code: Code; body: z.infer<ResB[Code]> };
  }[ResC]
>;

export type RouteHandler<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends { [key: number]: z.ZodType },
  ResC extends keyof ResB & StatusCode,
  PipelineContext extends BasePipelineContext
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
    ResC,
    PipelineContext
  >;
  pipeline: Pipeline<PipelineContext>;
};

// TODO is there a better way to connect this to serve.ts?
export type ValidationErrorStatusCode = 400;
export type ValidationErrors = Array<{ message: string; issue: ZodIssue }>;

export type Client<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends { [key: number]: z.ZodType },
  ResC extends keyof ResB & StatusCode
> = (props: {
  params: z.infer<ReqP>;
  query: z.infer<ReqQ>;
  body: z.infer<ReqB>;
}) => Promise<
  | {
      [Code in ResC]: {
        type: "network-call-succeeded";
        code: Code;
        body: z.infer<ResB[Code]>;
      };
    }[ResC]
  | {
      type: "network-call-succeeded";
      code: ValidationErrorStatusCode;
      body: ValidationErrors;
    }
  | {
      type: "failed-to-parse-body";
      text: string;
    }
  | {
      type: "network-call-failed";
      error: any;
    }
>;

export type Endpoint<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends { [key: number]: z.ZodType },
  ResC extends keyof ResB & StatusCode,
  PipelineContext extends BasePipelineContext
> = Client<
  EndpointDeclaration,
  PathParams,
  QueryParams,
  ReqP,
  ReqQ,
  ReqB,
  ResB,
  ResC
> & {
  routeHandler: RouteHandler<
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
};

export type CreateEndpointProps<
  EndpointDeclaration extends EndpointDeclarationBase,
  Method extends ExtractMethod<EndpointDeclaration>,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends { [key: number]: z.ZodType }
> = {
  response: ResB;
} & (Method extends "POST" ? { request: ReqB } : { request?: void }) &
  (PathParams extends void
    ? QueryParams extends void
      ? { query?: z.ZodVoid; params?: z.ZodVoid }
      : { query: ReqQ; params?: z.ZodVoid }
    : QueryParams extends void
    ? { query?: z.ZodVoid; params: ReqP }
    : { query: ReqQ; params: ReqP });

// TODO review
// test
type MissingMethods<T extends { method: string }> = Exclude<
  Method,
  T["method"]
>;

type TestCoverage = MissingMethods<
  RouteDefinition<any, any, any, any, any, any, any>
>;

type AssertNever<T extends never> = T;

type EnsureAllMethodsCovered = AssertNever<
  MissingMethods<RouteDefinition<any, any, any, any, any, any, any>>
>;
