import { z, type SafeParseReturnType } from "zod";
import { errorResult, okResult } from "../../../helpers/result";
import type {
  EndpointDeclarationBase,
  ExtractPathParams,
  Method,
  RouteDefinition,
} from "../../../helpers/types";
import { ValidationError, ValidationResult } from "./types";

const fakeSuccess: SafeParseReturnType<any, any> = {
  success: true,
  data: {},
};

async function getBody<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends z.ZodType | unknown,
  ReqB extends z.ZodType,
  ResB extends { [key: number]: z.ZodType }
>(
  body: unknown,
  method: Method,
  routeDefinition: RouteDefinition<
    EndpointDeclaration,
    PathParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >
): Promise<SafeParseReturnType<any, any>> {
  switch (method) {
    case "OPTIONS":
    case "GET": {
      return fakeSuccess;
    }
    case "POST":
    case "PUT":
    case "PATCH":
    case "DELETE": {
      return routeDefinition.body?.safeParse(body) ?? fakeSuccess;
    }
  }
}

function extractZodIssues(
  result: SafeParseReturnType<any, any>,
  type: "params" | "query" | "body"
): Array<ValidationError> {
  if (result.success) {
    return [];
  }

  return result.error.issues.map((issue) => {
    const info =
      issue.path.length === 0 ? type : `${type}.${issue.path.join(".")}`;

    return {
      message: `Problem with ${info}: ${issue.message}`,
    };
  });
}

export async function getValidationResult<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends z.ZodType | unknown,
  ReqB extends z.ZodType,
  ResB extends { [key: number]: z.ZodType }
>(
  body: any,
  method: Method,
  routeDefinition: RouteDefinition<
    EndpointDeclaration,
    PathParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >,
  params: unknown,
  queryString: string
): Promise<ValidationResult> {
  const queryParams = Object.fromEntries(
    new URLSearchParams(queryString).entries()
  );

  const query = Object.values(queryParams).length === 0 ? {} : queryParams;

  const paramsParseResult =
    routeDefinition.params?.safeParse(params) ?? fakeSuccess;

  const queryParseResult =
    (routeDefinition.query as z.ZodType)?.safeParse(query) ?? fakeSuccess;

  const bodyParseResult = await getBody(body, method, routeDefinition);

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
