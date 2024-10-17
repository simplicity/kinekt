import { z } from "zod";
import { abort } from "../helpers/abort";
import { consoleLogger } from "../helpers/consoleLogger";
import { extractMethod } from "../helpers/extractMethod";
import type { MimeType } from "../helpers/MimeType";
import { removeMethod } from "../helpers/removeMethod";
import { errorResult, okResult } from "../helpers/result";
import type {
  EndpointDeclarationBase,
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
  StatusCode,
} from "../types";
import { buildPathString } from "./helpers/buildPathString";
import { buildQueryString } from "./helpers/buildQueryString";
import { doFetch } from "./helpers/doFetch/doFetch";
import { parseBodyFromResponse } from "./helpers/parseBodyFromResponse/parseBodyFromResponse";
import type { Client } from "./types";

export type ClientOptions = {
  baseUrl: string | null;
};

// TODO test
export function createClient<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends { [key: number]: z.ZodType },
  ResC extends keyof ResB & StatusCode
>(
  routeDefinition: RouteDefinition<
    EndpointDeclaration,
    PathParams,
    QueryParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB
  >,
  params: {
    acceptHeader: MimeType;
    globalOptions: ClientOptions;
  }
): Client<
  EndpointDeclaration,
  PathParams,
  QueryParams,
  ReqP,
  ReqQ,
  ReqB,
  ResB,
  ResC,
  unknown
> {
  const path = removeMethod(routeDefinition.endpointDeclaration);
  const method = extractMethod(routeDefinition.endpointDeclaration);

  return async (props) => {
    const pathString = buildPathString(props.params, path);
    const queryString = buildQueryString(props.query);

    const url = `${params.globalOptions.baseUrl}${pathString}${queryString}`;

    const fetchResult = await doFetch(
      url,
      method,
      props.body,
      params.acceptHeader
    );

    if (fetchResult.type === "error") {
      return errorResult(
        "network-error",
        "Error encountered during fetch.",
        fetchResult.metadata
      );
    }

    const bodyParseResult = await parseBodyFromResponse(fetchResult.value);

    switch (bodyParseResult.type) {
      case "ok": {
        // TODO exclude these status codes from StatusCode type?

        if (fetchResult.value.status === 406) {
          consoleLogger.error(bodyParseResult);
          abort("Client received status code 406, which is unexpected.");
        }

        if (fetchResult.value.status === 415) {
          consoleLogger.error(bodyParseResult);
          abort("Client received status code 415, which is unexpected.");
        }

        if (fetchResult.value.status === 500) {
          return errorResult("internal-server-error", "Internal Server Error", {
            cause: bodyParseResult.value,
          });
        }

        return okResult({
          statusCode: fetchResult.value.status as ResC,
          body: bodyParseResult.value,
        });
      }
      case "error": {
        return bodyParseResult;
      }
    }
  };
}
