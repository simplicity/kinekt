import type { BasePipelineContextRequest } from "../../../createPipeline/helpers/types";
import type { Method } from "../../../helpers/types";
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
