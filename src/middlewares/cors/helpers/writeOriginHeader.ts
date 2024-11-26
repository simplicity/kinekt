import { NormalizedCorsParams } from "./types";

export function writeOriginHeader(
  params: NormalizedCorsParams,
  originHeader: string
): Record<string, string> {
  return {
    "access-control-allow-origin":
      params.origins === "*" && params.allowCredentials === false
        ? "*"
        : originHeader,
  };
}
