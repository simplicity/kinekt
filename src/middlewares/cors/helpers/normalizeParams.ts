import { CorsParams, NormalizedCorsParams } from "./types";

const simpleMethods = ["GET", "HEAD", "POST"];

// TODO test this
const simpleHeaders = ["Accept", "Accept-Language", "Content-Language"];

export function normalizeParams(params: CorsParams): NormalizedCorsParams {
  return {
    origins: params.origins,
    allowMethods:
      params.allowMethods === "ALL"
        ? { type: "all" }
        : {
            type: "specific",
            methods: [
              ...(params.allowMethods ?? ["PUT", "PATCH", "DELETE"]).filter(
                (method) => !simpleMethods.includes(method)
              ),
              ...simpleMethods,
            ]
              .map((m) => m.toUpperCase())
              .join(","),
          },
    allowHeaders:
      params.allowHeaders === "ALL"
        ? "ALL"
        : [...simpleHeaders, ...(params.allowHeaders ?? [])],
    allowCredentials: params.allowCredentials ?? false,
    allowPrivateNetwork: params.allowPrivateNetwork ?? false,
    exposeHeaders: (params.exposeHeaders ?? []).join(","),
    maxAge: params.maxAge ?? 0,
    passthroughNonCorsRequests: params.passthroughNonCorsRequests ?? false,
  };
}
