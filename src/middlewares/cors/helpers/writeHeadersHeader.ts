import { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { NormalizedCorsParams } from "./types";

export function writeHeadersHeader(
  params: NormalizedCorsParams,
  context: BasePipelineContext
): Record<string, string> {
  const requestedHeaders = context.request.getHeader(
    "access-control-request-headers"
  );

  if (requestedHeaders === null) {
    return {};
  }

  return {
    "access-control-allow-headers":
      params.allowHeaders.type === "all"
        ? requestedHeaders
        : params.allowHeaders.headers,
  };
}
