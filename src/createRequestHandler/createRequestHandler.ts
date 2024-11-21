import { HasPipeline } from "../helpers/types";
import { buildRouteTree } from "./helpers/buildRouteTree";
import { handleRequest } from "./helpers/handleRequest/handleRequest";
import type { HandleRequestParams } from "./helpers/handleRequest/types";

export type HandleRequestParamsWithoutRouteTree = Omit<
  HandleRequestParams,
  "routeTree"
>;

export function createRequestHandler(endpoints: Array<HasPipeline>) {
  const routeTree = buildRouteTree(
    endpoints.map((endpoint) => endpoint.pipeline)
  );

  return (params: HandleRequestParamsWithoutRouteTree) =>
    handleRequest({ ...params, routeTree });
}
