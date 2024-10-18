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
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
> = {
  (path: z.infer<ReqP>, query: z.infer<ReqQ>, body: z.infer<ReqB>): Promise<
    z.infer<ResB>
  >;
  routeHandler: RouteHandler<Path, ReqP, ReqQ, ReqB, ResB>;
};

export function createEndpoint<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
>(
  routeDefinition: RouteDefinition<Path, ReqP, ReqQ, ReqB, ResB>,
  callback: RouteHandlerCallback<Path, ReqP, ReqQ, ReqB, ResB>
): Endpoint<Path, ReqP, ReqQ, ReqB, ResB> {
  const client = createClient(routeDefinition) as Endpoint<
    Path,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >;

  client.routeHandler = createRouteHandler(routeDefinition, callback);

  return client;
}
