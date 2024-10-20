import type { z } from "npm:zod";
import type {
  Endpoint,
  EndpointDeclarationBase,
  ExtractMethod,
  ExtractPathParams,
  ExtractQueryParams,
  RouteHandlerCallback,
} from "../createEndpoint/types.ts";

export type BasePipelineContext = {
  request: {
    url: string;
    method: "GET" | "OPTIONS";
  };
  halted: boolean;
  response: null | {
    code: number;
    body: any;
  };
};

export type Middleware<
  PipelineContext extends BasePipelineContext,
  NewPipelineContext extends PipelineContext
> = (context: PipelineContext) => Promise<NewPipelineContext>;

export type Pipeline<PipelineContext extends BasePipelineContext> = {
  (context: BasePipelineContext): Promise<PipelineContext>;

  createEndpoint: <
    EndpointDeclaration extends EndpointDeclarationBase,
    Method extends ExtractMethod<EndpointDeclaration>,
    PathParams extends ExtractPathParams<EndpointDeclaration>,
    QueryParams extends ExtractQueryParams<EndpointDeclaration>,
    ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
    ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
    ReqB extends z.ZodType,
    ResB extends z.ZodType
  >(
    // TODO all of this was copypasted
    path: EndpointDeclaration,
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
  ) => Endpoint<
    EndpointDeclaration,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB,
    PipelineContext
  >;
};
