import { z } from "npm:zod";
import { parseBody } from "../../helpers/parseBody.ts";
import { removeMethod } from "../../helpers/removeMethod.ts";
import { removeQuery } from "../../helpers/removeQuery.ts";
import type {
  EndpointDeclarationBase,
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
} from "../types.ts";
import type { Client } from "./types.ts";

function buildPathString(params: any, path: string): string {
  return params
    ? Object.entries(params).reduce<string>(
        (acc, [key, value]) => acc.replace(`:${key}`, value as string),
        removeQuery(path)
      )
    : "";
}

function buildQueryString(query: any): string {
  const queryString = query
    ? Object.entries(query)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
    : "";

  return queryString === "" ? "" : `?${queryString}`;
}

export function createClient<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
>(
  routeDefinition: RouteDefinition<
    EndpointDeclaration,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >
): Client<
  EndpointDeclaration,
  PathParams,
  QueryParams,
  ReqP,
  ReqQ,
  ReqB,
  ResB
> {
  const path = removeMethod(routeDefinition.endpointDeclaration);

  return async ({ params, query, body }) => {
    const pathString = buildPathString(params, path);
    const queryString = buildQueryString(query);

    // TODO how to pass this as config?
    const rootUrl = "http://localhost:8000";

    const url = `${rootUrl}${pathString}${queryString}`;

    // TODO handle errors

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: routeDefinition.method,
      ...(body
        ? {
            body: JSON.stringify(body),
          }
        : {}),
    });

    return await parseBody(response);
  };
}
