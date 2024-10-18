import { z } from "npm:zod";
import { parseBody } from "../helpers/parseBody.ts";
import { removeQuery } from "../helpers/removeQuery.ts";
import type {
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
} from "../routeDefinition/types.ts";
import type { Client } from "./types.ts";

function buildPathString<
  Path extends string,
  PathParams extends ExtractPathParams<Path>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>
>(reqP: z.infer<ReqP>, path: Path): string {
  return reqP
    ? Object.entries(reqP).reduce<string>(
        (acc, [key, value]) => acc.replace(`:${key}`, value),
        removeQuery(path)
      )
    : "";
}

function buildQueryString<
  Path extends string,
  QueryParams extends ExtractQueryParams<Path>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>
>(query: z.infer<ReqQ>): string {
  const queryString = query
    ? Object.entries(query)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
    : "";

  return queryString === "" ? "" : `?${queryString}`;
}

export function createClient<
  Path extends string,
  PathParams extends ExtractPathParams<Path>,
  QueryParams extends ExtractQueryParams<Path>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
>(
  routeDefinition: RouteDefinition<
    Path,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >
): Client<Path, PathParams, QueryParams, ReqP, ReqQ, ReqB, ResB> {
  return async ({ path, query, body }) => {
    // TODO might make sense to do input validation here
    // - for body, because it might not be possible to declare the whole object in commander
    // - for the case where no typescript is used

    const pathString = buildPathString(path, routeDefinition.path);

    // TODO why is this any cast necessary?
    const queryString = buildQueryString(query as any);

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
