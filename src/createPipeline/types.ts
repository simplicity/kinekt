import type { z } from "npm:zod";
import type {
  CreateEndpointProps,
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
    // TODO rename
    path: EndpointDeclaration,
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
