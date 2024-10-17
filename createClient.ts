import { z } from "npm:zod";
import { parseBody } from "./parseBody.ts";
import type {
  Client,
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
} from "./types.ts";

export function createClient<
  Path extends string,
  ReqP extends z.ZodType<ExtractPathParams<Path>>,
  ReqQ extends z.ZodType<ExtractQueryParams<Path>>,
  ReqB extends z.ZodType,
  ResB extends z.ZodType
>(
  routeDefinition: RouteDefinition<Path, ReqP, ReqQ, ReqB, ResB>
): Client<Path, ReqP, ReqQ, ReqB, ResB> {
  return async (path, query, body) => {
    const pathString = Object.entries(path).reduce<string>(
      (acc, [key, value]) => acc.replace(`:${key}`, value),
      routeDefinition.path.replace(/\?.*$/, "") // TODO copy-pasted
    );

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
