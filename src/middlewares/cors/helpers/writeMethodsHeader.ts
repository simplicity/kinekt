import { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { NormalizedCorsParams } from "./types";

export function writeMethodsHeader(
  params: NormalizedCorsParams,
  context: BasePipelineContext
): Record<string, string> {
  const requestedMethod = context.request.getHeader(
    "Access-Control-Request-Method"
  );

  // TODO test this
  if (requestedMethod === null) {
    return {};
  }

  return {
    "Access-Control-Allow-Methods":
      params.allowMethods.type === "all"
        ? requestedMethod
        : params.allowMethods.methods,
  };
}
