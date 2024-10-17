import type { BasePipelineContextRequest } from "../../../createPipeline/types";
import type { Method } from "../../../types";
import type { PipelineRouteTree } from "../buildRouteTree";

export type HandleRequestParams = {
  method: Method;
  fullUrl: string;
  path: string;
  query: string;
  routeTree: PipelineRouteTree;
  getHeader: BasePipelineContextRequest["getHeader"];
  readText: BasePipelineContextRequest["readText"];
  readFormData: BasePipelineContextRequest["readFormData"];
};
