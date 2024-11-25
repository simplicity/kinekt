import {
  BasePipelineContext,
  Middleware,
} from "../../createPipeline/helpers/types";
import { matchOrigin } from "./helpers/matchOrigin";
import { normalizeParams } from "./helpers/normalizeParams";
import { reply } from "./helpers/reply";
import { CorsParams, NormalizedCorsParams } from "./helpers/types";

function handle(
  context: BasePipelineContext,
  params: NormalizedCorsParams
): BasePipelineContext {
  // TODO how to deal with upper/lower case in headers?
  const originHeader = context.request.getHeader("Origin");

  if (!originHeader) {
    // TODO what to do here?
    // if (passthroughNonCorsRequests) return false;
    // return true;

    return context;
  }

  const isPreflight =
    // TODO avoid cast
    (context.request.method as "OPTIONS") === "OPTIONS" &&
    // TODO is this check really correct? Isn't it automatically a preflight, if method is OPTION?
    //      -> absence of this header simply means that it is an invalid preflight request
    context.request.getHeader("Access-Control-Request-Method") !== null;

  if (!matchOrigin(originHeader, params.origins)) {
    if (isPreflight) {
      return {
        ...context,
        // TODO should we halt?
        response: {
          type: "set",
          body: null,
          statusCode: 200,
          headers: {},
        },
      };
    }

    // return true;
    // TODO what to do here?
    return context;
  }

  const headers: Record<string, string> = {};

  headers["Access-Control-Allow-Origin"] =
    params.origins === "*" && params.allowCredentials === false
      ? "*"
      : originHeader;

  const originVaries =
    params.origins === "*"
      ? params.allowCredentials
        ? true
        : false
      : params.origins.length > 1;

  if (originVaries) {
    headers["Vary"] = "origin";
  }

  if (params.allowCredentials) {
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  if (
    params.allowPrivateNetwork &&
    context.request.getHeader("access-control-request-private-network") !== null
  ) {
    headers["Access-Control-Allow-Private-Network"] = "true";
  }

  if (params.exposeHeaders !== "") {
    headers["Access-Control-Expose-Headers"] = params.exposeHeaders;
  }

  if (isPreflight) {
    // TODO what if this is not provided? -> it would be an invalid preflight
    const requestedMethod = context.request.getHeader(
      "Access-Control-Request-Method"
    );

    // TODO what if this is not provided? -> it is actually optional
    const requestedHeaders = context.request.getHeader(
      "Access-Control-Request-Headers"
    );

    if (params.allowMethods.type === "all") {
      headers["Access-Control-Allow-Methods"] = requestedMethod as string;
    } else {
      headers["Access-Control-Allow-Methods"] = params.allowMethods.methods;
    }

    if (params.allowHeaders === "ALL") {
      headers["Access-Control-Allow-Headers"] = requestedHeaders as string;
    } else if (requestedHeaders) {
      const requested = (requestedHeaders as string).split(",").map(
        (h) => h.trim()
        // TODO here we'd have to deal with lower case too
        // .toLowerCase()
      );

      headers["Access-Control-Allow-Headers"] = requested
        .filter((header) => params.allowHeaders.includes(header))
        .join(",");
    }

    // TODO test this
    if (params.maxAge > 0) {
      headers["Access-Control-Max-Age"] = params.maxAge.toString();
    }

    return reply(context, headers);
  }

  // TODO add tests for non-preflights
  return reply(context, headers);
}

export const cors = <In extends BasePipelineContext, Out extends In>(
  params: CorsParams
): Middleware<In, Out> => {
  const normalizedCorsParams = normalizeParams(params);

  const middleware: Middleware<In, Out> = async (context) =>
    handle(context, normalizedCorsParams) as Out;

  return middleware;
};
