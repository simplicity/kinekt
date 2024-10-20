import { z } from "npm:zod";
import type {
  ExtractPathParams,
  ExtractQueryParams,
  PathBase,
} from "../types.ts";

export type Client<
  Path extends PathBase,
  PathParams extends ExtractPathParams<Path>,
  QueryParams extends ExtractQueryParams<Path>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
> = (props: {
  // TODO rename to params?
  path: z.infer<ReqP>;
  query: z.infer<ReqQ>;
  body: z.infer<ReqB>;
}) => Promise<z.infer<ResB>>;
