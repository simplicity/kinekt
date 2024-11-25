import { NormalizedCorsParams } from "./types";

export function writeCredentialsHeader(
  params: NormalizedCorsParams
): Record<string, string> {
  return params.allowCredentials
    ? { "Access-Control-Allow-Credentials": "true" }
    : {};
}
