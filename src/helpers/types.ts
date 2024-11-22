import type { z } from "zod";
import { Pipeline } from "../createPipeline/helpers/types";

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

//prettier-ignore
export type StatusCode = | 100 | 101 | 102 
                         | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 
                         | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 
                         | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 428 | 429 | 431 | 451 
                         | 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;

export type RouteDefinition<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends z.ZodType | unknown,
  ReqB extends z.ZodType,
  ResB extends { [key: number]: z.ZodType }
> = {
  endpointDeclaration: EndpointDeclaration;
  response: ResB;
  query?: ReqQ;
} & (PathParams extends void ? { params?: z.ZodVoid } : { params: ReqP }) &
  (ExtractMethod<EndpointDeclaration> extends "GET"
    ? { body?: z.ZodVoid }
    : { body: ReqB });

export type RouteDefinitionWithoutEndpointDeclaration<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends z.ZodType | unknown,
  ReqB extends z.ZodType,
  ResB extends { [key: number]: z.ZodType }
> = {
  response: ResB;
  query?: ReqQ;
} & (PathParams extends void ? { params?: z.ZodVoid } : { params: ReqP }) &
  (ExtractMethod<EndpointDeclaration> extends "GET"
    ? { body?: z.ZodVoid }
    : { body: ReqB });

export type HasPipeline = {
  pipeline: Pipeline<any, any>;
};

type LoggerFunction = (...args: Array<unknown>) => void;

export type Logger = {
  debug: LoggerFunction;
  info: LoggerFunction;
  warn: LoggerFunction;
  error: LoggerFunction;
};
