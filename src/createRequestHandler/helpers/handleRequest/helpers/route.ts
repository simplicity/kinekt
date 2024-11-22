import type {
  BasePipelineContext,
  Pipeline,
} from "../../../../createPipeline/helpers/types";
import type { Method } from "../../../../helpers/types";
import { findRoute } from "../../../../routeTree/findRoute";
import type { PipelineRouteTree } from "../../buildRouteTree";

export function route(
  path: string,
  method: Method,
  routeTree: PipelineRouteTree
): {
  pipeline: Pipeline<BasePipelineContext, BasePipelineContext>;
  params: unknown;
} | null {
  const findRouteResult = findRoute(path.split("/"), routeTree[method], [], 0);

  const pipeline = findRouteResult.items.at(0);

  if (pipeline === undefined) {
    return null;
  }

  const params = findRouteResult.segmentMatches.reduce(
    (acc, item) => ({
      ...acc,
      ...(item.type === "param" ? { [item.name]: item.value } : {}),
    }),
    {} satisfies Record<string, string>
  );

  return {
    pipeline,
    params,
  };
}
