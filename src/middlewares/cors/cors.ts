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

function handle(
  context: BasePipelineContext,
  params: CorsParams
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
  } = { ...DEFAULT_OPTIONS, ...params };

  // TODO how to deal with upper/lower case in headers?
  const originHeader = context.request.getHeader("Origin");

  if (!originHeader) {
    // TODO what to do here?
    // if (passthroughNonCorsRequests) return false;
    // return true;

    return context;
  }

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

  const isPreflight =
    // TODO avoid cast
    (context.request.method as "OPTIONS") === "OPTIONS" &&
    context.request.getHeader("Access-Control-Request-Method") !== null;

  if (isPreflight) {
    const requestedMethod = context.request.getHeader(
      "Access-Control-Request-Method"
    );

    const requestedHeaders = context.request.getHeader(
      "Access-Control-Request-Headers"
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

    if (maxAge > 0) {
      headers["Access-Control-Max-Age"] = maxAge.toString();
    }

    // putCorsHeaders(res, headers);
    // res.writeHead(200);
    // res.end();
    // return true;

    // TODO put the headers
    return reply(context, headers);
  }

  // putCorsHeaders(res, headers);
  // return false;
  // TODO put the headers
  return reply(context, headers);
}

export const cors = <In extends BasePipelineContext, Out extends In>(
  params: CorsParams
): Middleware<In, Out> => {
  const middleware: Middleware<In, Out> = async (context) =>
    handle(context, params) as Out;

  return middleware;
};
