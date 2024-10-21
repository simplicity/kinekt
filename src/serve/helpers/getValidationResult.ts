import { z, ZodError, type SafeParseReturnType, type ZodIssue } from "npm:zod";
import type { RouteDefinition } from "../../createEndpoint/types.ts";
import { parseBody } from "../../helpers/parseBody.ts";
import type { Result } from "../../helpers/types.ts";
import type { MatchingRoute } from "../types.ts";

async function getBody(
  request: Request,
  routeDefinition: RouteDefinition<
    any,
    any,
    any,
    z.ZodType,
    z.ZodType,
    z.ZodType,
    any
  >
): Promise<SafeParseReturnType<any, any>> {
  switch (routeDefinition.method) {
    case "GET": {
      return {
        success: true,
        data: {},
      };
    }
    case "POST":
    case "PUT":
    case "PATCH":
    case "DELETE": {
      const body = await parseBody(request);
      switch (body.type) {
        case "ok": {
          return routeDefinition.requestBodySchema.safeParse(body);
        }
        case "error": {
          return {
            success: false,
            // TODO avoid throwing zod error
            error: new ZodError([]),
          };
        }
      }
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

export async function getValidationResult(
  request: Request,
  matchingRoute: MatchingRoute,
  queryString: string
): Promise<
  Result<
    {
      parsedParams: any;
      parsedQuery: any;
      parsedBody: any;
    },
    Array<{ message: string; issue: ZodIssue }>
  >
> {
  const queryParams = Object.fromEntries(
    new URLSearchParams(queryString).entries()
  );

  const query =
    Object.values(queryParams).length === 0 ? undefined : queryParams;

  const paramsParseResult =
    matchingRoute.routeHandler.routeDefinition.requestParamsSchema.safeParse(
      matchingRoute.params
    );

  const queryParseResult =
    matchingRoute.routeHandler.routeDefinition.requestQuerySchema.safeParse(
      query
    );

  const bodyParseResult = await getBody(
    request,
    matchingRoute.routeHandler.routeDefinition
  );

  if (
    bodyParseResult.success &&
    queryParseResult.success &&
    paramsParseResult.success
  ) {
    return {
      type: "ok",
      value: {
        parsedParams: paramsParseResult.data,
        parsedQuery: queryParseResult.data,
        parsedBody: bodyParseResult.data,
      },
    };
  }

  return {
    type: "error",
    error: [
      ...extractZodIssues(paramsParseResult, "params"),
      ...extractZodIssues(queryParseResult, "query"),
      ...extractZodIssues(bodyParseResult, "body"),
    ],
  };
}
