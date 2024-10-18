import type z from "npm:zod";
import type {
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
} from "../routeDefinition/types.ts";

export type RouteHandlerCallback<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
> = (params: {
  params: z.infer<ReqP>;
  query: z.infer<ReqQ>;
  body: z.infer<ReqB>;
}) => Promise<z.infer<ResB>>;

export type RouteHandler<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
> = {
  routeDefinition: RouteDefinition<Path, ReqP, ReqQ, ReqB, ResB>;
  callback: RouteHandlerCallback<Path, ReqP, ReqQ, ReqB, ResB>;
};
