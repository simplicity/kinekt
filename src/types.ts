import { z } from "npm:zod";

type ExtractParams<Path extends string> =
  Path extends `:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractParams<Rest>]: any }
    : Path extends `:${infer Param}`
    ? { [K in Param]: any }
    : Path extends `${infer _Segment}/${infer Rest}`
    ? ExtractParams<Rest>
    : {};

type ExtractQuery<Query extends string> = Query extends ""
  ? void // Return void for no query params
  : Query extends `${infer Param}&${infer Rest}`
  ? { [K in Param | keyof ExtractQuery<Rest>]: any }
  : Query extends `${infer Param}`
  ? { [K in Param]: any }
  : {};

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
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ResB extends z.ZodType
> = {
  path: Path;
  requestParamsSchema: ReqP;
  requestQuerySchema: ReqQ;
  responseBodySchema: ResB;
};

export type RouteDefinition<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
> =
  | ({
      method: "get";
    } & RouteDefinitionDefaults<Path, ReqP, ReqQ, ResB>)
  | ({
      method: "post";
      requestBodySchema: ReqB;
    } & RouteDefinitionDefaults<Path, ReqP, ReqQ, ResB>);

export type RouteHandler<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
> = (
  params: z.infer<ReqP>,
  query: z.infer<ReqQ>,
  body: z.infer<ReqB>
) => Promise<z.infer<ResB>>;

export type Client<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
> = (
  path: z.infer<ReqP>,
  query: z.infer<ReqQ>,
  body: z.infer<ReqB>
) => Promise<z.infer<ResB>>;

export type RouteRegistration<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
> = {
  routeDefinition: RouteDefinition<Path, ReqP, ReqQ, ReqB, ResB>;
  handler: RouteHandler<Path, ReqP, ReqQ, ReqB, ResB>;
};
