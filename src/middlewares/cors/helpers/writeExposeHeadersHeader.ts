import { NormalizedCorsParams } from "./types";

export function writeExposeHeadersHeader(
  params: NormalizedCorsParams
): Record<string, string> {
  return params.exposeHeaders
    ? { "Access-Control-Expose-Headers": params.exposeHeaders }
    : {};
}
