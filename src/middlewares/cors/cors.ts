import {
  BasePipelineContext,
  Middleware,
} from "../../createPipeline/helpers/types";
import { isSimpleHeader } from "./helpers/isSimpleHeader";
import { matchOrigin } from "./helpers/matchOrigin";
import { CorsOptions } from "./helpers/types";

const DEFAULT_OPTIONS: Required<Omit<CorsOptions, "origins">> = {
  allowMethods: ["PUT", "PATCH", "DELETE"],
  allowHeaders: [],
  allowCredentials: false,
  allowPrivateNetwork: false,
  exposeHeaders: [],
  maxAge: 0,
  passthroughNonCorsRequests: false,
};

function handle(
  context: BasePipelineContext,
  options: CorsOptions
): BasePipelineContext {
  const {
    origins,
    allowMethods,
    allowHeaders,
    allowCredentials,
    allowPrivateNetwork,
    exposeHeaders,
    maxAge,
    passthroughNonCorsRequests,
  } = { ...DEFAULT_OPTIONS, ...options };

  // TODO how to deal with upper/lower case in headers?
  const originHeader = context.request.getHeader("origin");

  if (!originHeader) {
    // TODO what to do here?
    // if (passthroughNonCorsRequests) return false;
    // return true;

    return context;
  }

  const isPreflight =
    // TODO avoid cast
    (context.request.method as "OPTIONS") === "OPTIONS" &&
    context.request.getHeader("access-control-request-method") !== null;

  if (!matchOrigin(originHeader, origins)) {
    // return true;
    // TODO what to do here?
    return context;
  }

  const headers: Record<string, string> = {};

  headers["Access-Control-Allow-Origin"] = origins === "*" ? "*" : originHeader;

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
    const requestedMethod = context.request.getHeader(
      "access-control-request-method"
    );

    const requestedHeaders = context.request.getHeader(
      "access-control-request-headers"
    );

    if (allowMethods === "ALL") {
      headers["Access-Control-Allow-Methods"] = requestedMethod as string;
    } else {
      headers["Access-Control-Allow-Methods"] = [
        ...allowMethods,
        ...["GET", "HEAD", "POST"],
      ]
        .map((m) => m.toUpperCase())
        .join(",");
    }

    if (allowHeaders === "ALL") {
      headers["Access-Control-Allow-Headers"] = requestedHeaders as string;
    } else if (requestedHeaders) {
      const requested = (requestedHeaders as string)
        .split(",")
        .map((h) => h.trim().toLowerCase());

      headers["Access-Control-Allow-Headers"] = requested
        .filter(
          (header) => isSimpleHeader(header) || allowHeaders.includes(header)
        )
        .join(",");
    }

    if (maxAge > 0) {
      headers["Access-Control-Max-Age"] = maxAge.toString();
    }

    // putCorsHeaders(res, headers);
    // res.writeHead(200);
    // res.end();
    // return true;

    // TODO put the headers
    return context;
  }

  // putCorsHeaders(res, headers);
  // return false;
  // TODO put the headers
  return context;
}

export const deserialize = <In extends BasePipelineContext, Out extends In>(
  options: CorsOptions
): Middleware<In, Out> => {
  const middleware: Middleware<In, Out> = async (context) =>
    handle(context, options) as Out;

  return middleware;
};
