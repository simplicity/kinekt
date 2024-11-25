import { NormalizedCorsParams } from "./types";

export function writeOriginHeader(
  params: NormalizedCorsParams,
  originHeader: string
): Record<string, string> {
  return {
    "Access-Control-Allow-Origin":
      params.origins === "*" && params.allowCredentials === false
        ? "*"
        : originHeader,
  };
}
