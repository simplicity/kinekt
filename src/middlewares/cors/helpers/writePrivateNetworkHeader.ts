import { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { NormalizedCorsParams } from "./types";

// TODO test
export function writePrivateNetworkHeader(
  params: NormalizedCorsParams,
  context: BasePipelineContext
): Record<string, string> {
  return params.allowPrivateNetwork &&
    context.request.getHeader("access-control-request-private-network") !== null
    ? { "access-control-allow-private-network": "true" }
    : {};
}
