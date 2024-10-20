// TODO extract types

import type { z } from "npm:zod";
import { createEndpoint } from "../createEndpoint/createEndpoint.ts";
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

type UnaryFunction<A, B> = (a: A) => Promise<B>;

async function process(
  input: BaseContext,
  fns: Array<UnaryFunction<any, any>>
) {
  if (input.halted === true) {
    console.log("pipeline halted");

    return input;
  }

  const [fn, ...rest] = fns;

  if (fn === undefined) {
    console.log("pipeline ended");

    return input;
  }

  return process(await fn(input), rest);
}

export function pipeline<R1 extends BaseContext, R2 extends R1, R3 extends R2>(
  f1: UnaryFunction<BaseContext, R1>,
  f2: UnaryFunction<R1, R2>,
  f3: UnaryFunction<R2, R3>
): Pipeline<R3>;

export function pipeline<R1 extends BaseContext, R2 extends R1>(
  f1: UnaryFunction<BaseContext, R1>,
  f2: UnaryFunction<R1, R2>
): Pipeline<R2>;

export function pipeline(...fns: Array<UnaryFunction<any, any>>) {
  const p = ((context: BaseContext) => process(context, fns)) as Pipeline<any>;
  p.createEndpoint = (...args) => createEndpoint(p, ...args);
  return p;
}
