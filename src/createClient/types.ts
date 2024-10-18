import { z } from "npm:zod";
import type {
  ExtractPathParams,
  ExtractQueryParams,
} from "../routeDefinition/types.ts";

export type Client<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
> = (
  path: z.infer<ReqP>,
  query: z.infer<ReqQ>,
  body: z.infer<ReqB>
) => Promise<z.infer<ResB>>;
