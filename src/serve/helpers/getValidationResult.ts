import { z, ZodVoid, type SafeParseReturnType, type ZodIssue } from "npm:zod";
import type { RouteDefinition } from "../../createEndpoint/types.ts";
import { parseBody } from "../../helpers/parseBody.ts";
import type { MatchingRoute } from "../types.ts";

type Result<Value, Error> =
  | { type: "ok"; value: Value }
  | { type: "error"; error: Error };

// TODO review this
function getBody(
  routeDefinition: RouteDefinition<
    any,
    any,
    any,
    z.ZodType,
    z.ZodType,
    z.ZodType,
    z.ZodType
  >,
  body: any
): SafeParseReturnType<any, any> {
  switch (routeDefinition.method) {
    case "GET": {
      return {
        success: true,
        data: {},
      };
    }
    case "POST": {
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

function validate(
  routeDefinition: RouteDefinition<
    any,
    any,
    any,
    z.ZodType,
    z.ZodType,
    z.ZodType,
    z.ZodType
  >,
  params: any,
  query: any,
  body: any
): Result<
  {
    parsedParams: any;
    parsedQuery: any;
    parsedBody: any;
  },
  Array<{ message: string; issue: ZodIssue }>
> {
  const paramsParseResult =
    routeDefinition.requestParamsSchema.safeParse(params);

  const queryParseResult = routeDefinition.requestQuerySchema.safeParse(query);

  const bodyParseResult = getBody(routeDefinition, body);

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

export async function getValidationResult(
  request: Request,
  matchingRoute: MatchingRoute,
  queryString: string
) {
  const queryParams = Object.fromEntries(
    new URLSearchParams(queryString).entries()
  );

  const requestBody =
    matchingRoute.routeHandler.routeDefinition.method === "GET" // TODO improve
      ? undefined
      : await parseBody(request);

  return validate(
    matchingRoute.routeHandler.routeDefinition,
    matchingRoute.params,
    // TODO not great
    Object.values(queryParams).length === 0 ? undefined : queryParams,
    requestBody
  );
}
