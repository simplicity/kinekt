import type z from "npm:zod";
import { createClient } from "../createClient/createClient.ts";
import { createRouteHandler } from "../createRouteHandler/createRouteHandler.ts";
import type {
  RouteHandler,
  RouteHandlerCallback,
} from "../createRouteHandler/types.ts";
import type {
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
} from "../routeDefinition/types.ts";

type Endpoint<
  Path extends string,
  PathParams extends ExtractPathParams<Path>,
  QueryParams extends ExtractQueryParams<Path>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
> = {
  (path: z.infer<ReqP>, query: z.infer<ReqQ>, body: z.infer<ReqB>): Promise<
    z.infer<ResB>
  >;
  routeHandler: RouteHandler<
    Path,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >;
};

export function createEndpoint<
  Path extends string,
  PathParams extends ExtractPathParams<Path>,
  QueryParams extends ExtractQueryParams<Path>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
>(
  routeDefinition: RouteDefinition<
    Path,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >,
  callback: RouteHandlerCallback<
    Path,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >
): Endpoint<Path, PathParams, QueryParams, ReqP, ReqQ, ReqB, ResB> {
  const client = createClient(routeDefinition) as Endpoint<
    Path,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >;

  client.routeHandler = createRouteHandler(routeDefinition, callback);

  return client;
}
