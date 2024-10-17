import type z from "npm:zod";
import { ZodVoid, type SafeParseReturnType, type ZodIssue } from "npm:zod";
import type {
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
} from "./types.ts";

type Validator = (options: { params: any; query: any; body: any }) => {
  parsedParams: any;
  parsedQuery: any;
  parsedBody: any;
};

function parseBody<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
>(
  routeDefinition: RouteDefinition<Path, ReqP, ReqQ, ReqB, ResB>,
  body: any
): SafeParseReturnType<any, any> {
  switch (routeDefinition.method) {
    case "get": {
      return {
        success: true,
        data: {},
      };
    }
    case "post": {
      if (
        // The express.json() middleware automatically sets body to an empty object ({}),
        // which is why we have to introduce a special handling here.
        routeDefinition.requestBodySchema instanceof ZodVoid &&
        Object.entries(body).length === 0
      ) {
        return {
          success: true,
          data: {},
        };
      }

      return routeDefinition.requestBodySchema.safeParse(body);
    }
  }
}

function extractZodIssues(
  result: SafeParseReturnType<any, any>,
  type: string
): { message: string; issue: ZodIssue }[] {
  if (result.success) {
    return [];
  }

  return result.error.issues.map((issue) => ({
    message: `Problem with ${type} param ${issue.path.join(".")}`,
    issue,
  }));
}

export function createValidator<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
>(routeDefinition: RouteDefinition<Path, ReqP, ReqQ, ReqB, ResB>): Validator {
  return ({ query, body, params }) => {
    const paramsParseResult =
      routeDefinition.requestParamsSchema.safeParse(params);
    const queryParseResult =
      routeDefinition.requestQuerySchema.safeParse(query);
    const bodyParseResult = parseBody(routeDefinition, body);

    if (
      bodyParseResult.success &&
      queryParseResult.success &&
      paramsParseResult.success
    ) {
      return {
        parsedParams: paramsParseResult.data,
        parsedQuery: queryParseResult.data,
        parsedBody: bodyParseResult.data,
      };
    }

    // TODO avoid throwing errors
    throw new Error("Validation errors", {
      cause: [
        ...extractZodIssues(paramsParseResult, "params"),
        ...extractZodIssues(queryParseResult, "query"),
        ...extractZodIssues(bodyParseResult, "body"),
      ],
    });
  };
}
