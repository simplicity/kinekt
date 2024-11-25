import { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { NormalizedCorsParams } from "./types";

export function writeHeadersHeader(
  params: NormalizedCorsParams,
  context: BasePipelineContext
): Record<string, string> {
  // TODO what if this is not provided? -> it is actually optional
  const requestedHeaders = context.request.getHeader(
    "Access-Control-Request-Headers"
  );

  if (requestedHeaders === null) {
    return {};
  }

  return {
    "Access-Control-Allow-Headers":
      params.allowHeaders === "ALL"
        ? requestedHeaders
        : requestedHeaders
            .split(",")
            .map(
              (h) => h.trim()
              // TODO here we'd have to deal with lower case too
              // .toLowerCase()
            )
            .filter((header) => params.allowHeaders.includes(header))
            .join(","),
  };
}
