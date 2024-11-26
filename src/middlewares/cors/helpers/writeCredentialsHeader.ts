import { NormalizedCorsParams } from "./types";

export function writeCredentialsHeader(
  params: NormalizedCorsParams
): Record<string, string> {
  return params.allowCredentials
    ? { "access-control-allow-credentials": "true" }
    : {};
}
