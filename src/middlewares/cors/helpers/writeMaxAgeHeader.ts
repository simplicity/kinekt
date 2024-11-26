import { NormalizedCorsParams } from "./types";

export function writeMaxAgeHeader(
  params: NormalizedCorsParams
): Record<string, string> {
  return params.maxAge > 0
    ? { "Access-Control-Max-Age": params.maxAge.toString() }
    : {};
}
