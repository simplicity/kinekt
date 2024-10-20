import type { z } from "npm:zod";
import type {
  Endpoint,
  ExtractMethod,
  ExtractPathParams,
  ExtractQueryParams,
  RouteHandlerCallback,
} from "../createEndpoint/types.ts";

export type BaseContext = {
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
  Context extends BaseContext,
  NewContext extends Context
> = (context: Context) => Promise<NewContext>;

export type Pipeline<Context extends BaseContext> = {
  (context: BaseContext): Promise<Context>;

  createEndpoint: <
    Path extends string,
    Method extends ExtractMethod<Path>,
    PathParams extends ExtractPathParams<Path>,
    QueryParams extends ExtractQueryParams<Path>,
    ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
    ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
    ReqB extends z.ZodType,
    ResB extends z.ZodType
  >(
    // TODO all of this was copypasted
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
  ) => Endpoint<Path, PathParams, QueryParams, ReqP, ReqQ, ReqB, ResB, Context>;
};
