import { z, type SafeParseReturnType, type ZodIssue } from "npm:zod";
import type {
  RouteDefinition,
  ValidationErrors,
} from "../../createEndpoint/types.ts";
import { parseBody } from "../../helpers/parseBody.ts";
import {
  errorResult,
  fallback_c,
  okResult,
  type Result,
} from "../../helpers/result.ts";
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
      const body = await parseBody(request).then(fallback_c({}));
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
    "validation-error",
    { validationErrors: ValidationErrors }
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
    return okResult({
      parsedParams: paramsParseResult.data,
      parsedQuery: queryParseResult.data,
      parsedBody: bodyParseResult.data,
    });
  }

  return errorResult("validation-error", "Validation failed.", {
    validationErrors: [
      ...extractZodIssues(paramsParseResult, "params"),
      ...extractZodIssues(queryParseResult, "query"),
      ...extractZodIssues(bodyParseResult, "body"),
    ],
  });
}
