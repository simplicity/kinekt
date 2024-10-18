import { z } from "npm:zod";
import { parseBody } from "../helpers/parseBody.ts";
import { removeQuery } from "../helpers/removeQuery.ts";
import type {
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
} from "../routeDefinition/types.ts";
import type { Client } from "./types.ts";

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

    const pathString = path
      ? Object.entries(path).reduce<string>(
          (acc, [key, value]) => acc.replace(`:${key}`, value),
          removeQuery(routeDefinition.path)
        )
      : "";

    let queryString = query
      ? Object.entries(query)
          .filter(([, value]) => value)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")
      : "";

    queryString = queryString === "" ? "" : `?${queryString}`;

    const rootUrl = "http://localhost:8000";

    const url = `${rootUrl}${pathString}${queryString}`;

    // TODO handle errors

    console.log(`calling ${url}`);

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
