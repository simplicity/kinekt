import { CorsParams, NormalizedCorsParams } from "./types";

const simpleMethods = ["GET", "HEAD", "POST"];

export function normalizeParams(params: CorsParams): NormalizedCorsParams {
  return {
    origins: params.origins,
    allowMethods:
      params.allowMethods === "ALL"
        ? { type: "all" }
        : {
            type: "specific",
            methods: [
              ...simpleMethods,
              ...(params.allowMethods ?? ["PUT", "PATCH", "DELETE"]).filter(
                (method) => !simpleMethods.includes(method)
              ),
            ]
              .map((m) => m.toUpperCase())
              .join(","),
          },
    allowHeaders:
      params.allowHeaders === "ALL"
        ? { type: "all" }
        : {
            type: "specific",
            headers: [...(params.allowHeaders ?? [])].join(","),
          },
    allowCredentials: params.allowCredentials ?? false,
    allowPrivateNetwork: params.allowPrivateNetwork ?? false,
    exposeHeaders: (params.exposeHeaders ?? []).join(","),
    maxAge: params.maxAge ?? 0,
  };
}
