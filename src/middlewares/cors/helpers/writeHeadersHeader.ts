import { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { NormalizedCorsParams } from "./types";

export function writeHeadersHeader(
  params: NormalizedCorsParams,
  context: BasePipelineContext
): Record<string, string> {
  const requestedHeaders = context.request.getHeader(
    "Access-Control-Request-Headers"
  );

  if (requestedHeaders === null) {
    return {};
  }

  return {
    "Access-Control-Allow-Headers":
      params.allowHeaders.type === "all"
        ? requestedHeaders
        : params.allowHeaders.headers,
  };
}
