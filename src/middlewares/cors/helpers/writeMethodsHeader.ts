import { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { NormalizedCorsParams } from "./types";

export function writeMethodsHeader(
  params: NormalizedCorsParams,
  context: BasePipelineContext
): Record<string, string> {
  const requestedMethod = context.request.getHeader(
    "access-control-request-method"
  );

  if (requestedMethod === null) {
    return {};
  }

  return {
    "access-control-allow-methods":
      params.allowMethods.type === "all"
        ? requestedMethod
        : params.allowMethods.methods,
  };
}
