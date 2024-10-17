import { z } from "npm:zod";
import { createValidator } from "./createValidator.ts";
import type {
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
  RouteHandler,
} from "./types.ts";

export function registerEndpoint<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
>(
  routeDefinition: RouteDefinition<Path, ReqP, ReqQ, ReqB, ResB>,
  handler: RouteHandler<Path, ReqP, ReqQ, ReqB, ResB>
) {
  const validate = createValidator(routeDefinition);

  async function handle(request: Request) {
    const validationResult = validate({
      params: null, // TODO how to get params
      query: null, // TODO how to get query
      body: null, // TODO how to get body
    });

    const result = await handler({
      params: validationResult.parsedParams,
      query: validationResult.parsedQuery,
      body: validationResult.parsedBody,
    });
  }
}
