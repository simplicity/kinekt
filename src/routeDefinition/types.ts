import { z } from "npm:zod";

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

type SplitPathAndQuery<Url extends string> =
  Url extends `${infer Path}?${infer Query}` ? [Path, Query] : [Url, ""];

export type ExtractPathParams<Url extends string> = ExtractParams<
  SplitPathAndQuery<Url>[0]
>;

export type ExtractQueryParams<Url extends string> = ExtractQuery<
  SplitPathAndQuery<Url>[1]
>;

type RouteDefinitionDefaults<
  Path extends string,
  PathParams extends ExtractPathParams<Path>,
  QueryParams extends ExtractQueryParams<Path>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ResB extends z.ZodType
> = {
  path: Path;
  requestParamsSchema: ReqP;
  requestQuerySchema: ReqQ;
  responseBodySchema: ResB;
};

export type RouteDefinition<
  Path extends string,
  PathParams extends ExtractPathParams<Path>,
  QueryParams extends ExtractQueryParams<Path>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
> =
  | ({
      method: "get";
    } & RouteDefinitionDefaults<
      Path,
      PathParams,
      QueryParams,
      ReqP,
      ReqQ,
      ResB
    >)
  | ({
      method: "post";
      requestBodySchema: ReqB;
    } & RouteDefinitionDefaults<
      Path,
      PathParams,
      QueryParams,
      ReqP,
      ReqQ,
      ResB
    >);
