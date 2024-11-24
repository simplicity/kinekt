import { IncomingMessage, ServerResponse } from "http";
import { isSimpleHeader } from "./helpers/isSimpleHeader";
import { matchOrigin } from "./helpers/matchOrigin";
import { putCorsHeaders } from "./helpers/putCorsHeaders";
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

function handleCorsRequest(
  req: IncomingMessage,
  res: ServerResponse,
  options: CorsOptions
): boolean {
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

  const originHeader = req.headers.origin;

  if (!originHeader) {
    if (passthroughNonCorsRequests) return false;
    return true;
  }

  const isPreflight =
    req.method === "OPTIONS" && req.headers["access-control-request-method"];
  const headers: Record<string, string | undefined> = {};

  if (!matchOrigin(originHeader, origins)) {
    return true;
  }

  headers["Access-Control-Allow-Origin"] = origins === "*" ? "*" : originHeader;

  if (allowCredentials) {
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  if (
    allowPrivateNetwork &&
    req.headers["access-control-request-private-network"]
  ) {
    headers["Access-Control-Allow-Private-Network"] = "true";
  }

  if (exposeHeaders.length > 0) {
    headers["Access-Control-Expose-Headers"] = exposeHeaders.join(",");
  }

  if (isPreflight) {
    const requestedMethod = req.headers["access-control-request-method"];
    const requestedHeaders = req.headers["access-control-request-headers"];

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

    putCorsHeaders(res, headers);
    res.writeHead(200);
    res.end();
    return true;
  }

  putCorsHeaders(res, headers);
  return false;
}

export { CorsOptions, handleCorsRequest };
