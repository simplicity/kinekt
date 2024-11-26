import { NormalizedCorsParams } from "./types";

export function writeExposeHeadersHeader(
  params: NormalizedCorsParams
): Record<string, string> {
  return params.exposeHeaders
    ? { "access-control-expose-headers": params.exposeHeaders }
    : {};
}
