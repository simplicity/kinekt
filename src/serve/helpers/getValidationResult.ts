import { z, type SafeParseReturnType, type ZodIssue } from "npm:zod";
import type { RouteDefinition } from "../../createEndpoint/types.ts";
import { parseBody } from "../../helpers/parseBody.ts";
import type { MatchingRoute } from "../types.ts";

type Result<Value, Error> =
  | { type: "ok"; value: Value }
  | { type: "error"; error: Error };

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

async function validate(
  request: Request,
  routeDefinition: RouteDefinition<
    any,
    any,
    any,
    z.ZodType,
    z.ZodType,
    z.ZodType,
    any
  >,
  params: any,
  query: any
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
  const paramsParseResult =
    routeDefinition.requestParamsSchema.safeParse(params);

  const queryParseResult = routeDefinition.requestQuerySchema.safeParse(query);

  const bodyParseResult = await getBody(request, routeDefinition);

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

export function getValidationResult(
  request: Request,
  matchingRoute: MatchingRoute,
  queryString: string
) {
  const queryParams = Object.fromEntries(
    new URLSearchParams(queryString).entries()
  );

  return validate(
    request,
    matchingRoute.routeHandler.routeDefinition,
    matchingRoute.params,
    // TODO not great
    Object.values(queryParams).length === 0 ? undefined : queryParams
  );
}
