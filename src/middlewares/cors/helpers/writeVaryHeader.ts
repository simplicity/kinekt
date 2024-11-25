import { NormalizedCorsParams } from "./types";

function originVaries(params: NormalizedCorsParams) {
  return params.origins === "*"
    ? params.allowCredentials
      ? true
      : false
    : params.origins.length > 1;
}

export function writeVaryHeader(
  params: NormalizedCorsParams
): Record<string, string> {
  return originVaries(params) ? { Vary: "origin" } : {};
}
