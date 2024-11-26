import { NormalizedCorsParams } from "./types";

export function writePrivateNetworkHeader(
  params: NormalizedCorsParams
): Record<string, string> {
  return params.allowPrivateNetwork
    ? { "access-control-allow-private-network": "true" }
    : {};
}
