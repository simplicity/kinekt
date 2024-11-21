import type { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { type Result, errorResult, okResult } from "../../../helpers/result";
import { route } from "./helpers/route";
import type { HandleRequestParams } from "./types";

export type HandleRequestResult = Result<BasePipelineContext, "no-route-found">;

export async function handleRequest(
  params: HandleRequestParams
): Promise<HandleRequestResult> {
  const routeResult = route(params.path, params.method, params.routeTree);

  if (routeResult === null) {
    return errorResult("no-route-found", "", undefined);
  }

  const context: BasePipelineContext = {
    request: {
      method: params.method,
      fullUrl: params.fullUrl,
      path: params.path,
      params: routeResult.params,
      query: params.query,
      getHeader: params.getHeader,
      readText: params.readText,
      readFormData: params.readFormData,
    },
    response: { type: "unset" },
    error: { type: "no-error" },
    startTime: performance.now(),
    metadata: routeResult.pipeline.collectMetadata(),
  };

  return okResult(await routeResult.pipeline(context));
}
