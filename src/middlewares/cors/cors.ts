import {
  BasePipelineContext,
  Middleware,
} from "../../createPipeline/helpers/types";
import { isSimpleHeader } from "./helpers/isSimpleHeader";
import { matchOrigin } from "./helpers/matchOrigin";
import { reply } from "./helpers/reply";
import { CorsParams } from "./helpers/types";

const DEFAULT_OPTIONS: Required<Omit<CorsParams, "origins">> = {
  allowMethods: ["PUT", "PATCH", "DELETE"],
  allowHeaders: [],
  allowCredentials: false,
  allowPrivateNetwork: false,
  exposeHeaders: [],
  maxAge: 0,
  passthroughNonCorsRequests: false,
};

const simpleMethods = ["GET", "HEAD", "POST"];

function handle(
  context: BasePipelineContext,
  params: CorsParams
): BasePipelineContext {
  const {
    origins, // TODO what happens when this is empty?
    allowMethods,
    allowHeaders,
    allowCredentials,
    allowPrivateNetwork,
    exposeHeaders,
    maxAge,
    passthroughNonCorsRequests,
  } = { ...DEFAULT_OPTIONS, ...params };

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

  if (!matchOrigin(originHeader, origins)) {
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
    origins === "*" && allowCredentials === false ? "*" : originHeader;

  const originVaries =
    origins === "*" ? (allowCredentials ? true : false) : origins.length > 1;

  if (originVaries) {
    headers["Vary"] = "origin";
  }

  if (allowCredentials) {
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  if (
    allowPrivateNetwork &&
    context.request.getHeader("access-control-request-private-network") !== null
  ) {
    headers["Access-Control-Allow-Private-Network"] = "true";
  }

  if (exposeHeaders.length > 0) {
    headers["Access-Control-Expose-Headers"] = exposeHeaders.join(",");
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

    if (allowMethods === "ALL") {
      headers["Access-Control-Allow-Methods"] = requestedMethod as string;
    } else {
      headers["Access-Control-Allow-Methods"] = [
        // TODO this filtering could be done somewhere else
        ...allowMethods.filter((method) => !simpleMethods.includes(method)),
        ...simpleMethods,
      ]
        .map((m) => m.toUpperCase())
        .join(",");
    }

    if (allowHeaders === "ALL") {
      headers["Access-Control-Allow-Headers"] = requestedHeaders as string;
    } else if (requestedHeaders) {
      const requested = (requestedHeaders as string).split(",").map(
        (h) => h.trim()
        // TODO here we'd have to deal with lower case too
        // .toLowerCase()
      );

      headers["Access-Control-Allow-Headers"] = requested
        .filter(
          (header) => isSimpleHeader(header) || allowHeaders.includes(header)
        )
        .join(",");
    }

    // TODO test this
    if (maxAge > 0) {
      headers["Access-Control-Max-Age"] = maxAge.toString();
    }

    return reply(context, headers);
  }

  // TODO add tests for non-preflights
  return reply(context, headers);
}

export const cors = <In extends BasePipelineContext, Out extends In>(
  params: CorsParams
): Middleware<In, Out> => {
  const middleware: Middleware<In, Out> = async (context) =>
    handle(context, params) as Out;

  return middleware;
};
