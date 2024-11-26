import {
  type BasePipelineContext,
  type Pipeline,
} from "../../createPipeline/helpers/types";
import { abort } from "../../helpers/abort";
import {
  isRouteMatchMetadata,
  type RouteMatchMetadata,
} from "../../helpers/routeMatch";
import type { Method } from "../../helpers/types";
import { validMethods } from "../../helpers/validMethods";
import { addPath } from "../../routeTree/addPath";
import type { RouteTree } from "../../routeTree/helpers/types";

type RootPipelineRouteTree = RouteTree<
  Pipeline<BasePipelineContext, BasePipelineContext>
>;

export type PipelineRouteTree = Record<Method, RootPipelineRouteTree>;

function addForAllValidMethods(
  startAcc: PipelineRouteTree,
  parts: Array<string>,
  pipeline: Pipeline<any, any>
) {
  return validMethods.reduce(
    (acc, method) => ({
      ...acc,
      [method]: addPath(parts, acc[method], pipeline),
    }),
    startAcc
  );
}

function addForAllMatchers(
  startAcc: PipelineRouteTree,
  routeMatchMetadata: RouteMatchMetadata,
  pipeline: Pipeline<any, any>
) {
  return routeMatchMetadata.matchers.reduce((acc, matcher) => {
    const parts = matcher.path.replace(/^\//, "").split("/");

    return matcher.method === "ANY"
      ? addForAllValidMethods(acc, parts, pipeline)
      : {
          ...acc,
          [matcher.method]: addPath(parts, acc[matcher.method], pipeline),
        };
  }, startAcc);
}

const root: RootPipelineRouteTree = {
  segment: { type: "root" },
  children: [],
  items: [],
};

const startAcc: PipelineRouteTree = {
  GET: root,
  POST: root,
  PATCH: root,
  PUT: root,
  DELETE: root,
  OPTIONS: root, // TODO how do we route these?
};

function addForAllPipelines(pipelines: Array<Pipeline<any, any>>) {
  return pipelines.reduce((acc, pipeline) => {
    const metadata = pipeline.collectMetadata();

    const routeMatchMetadata = metadata.find(isRouteMatchMetadata);

    if (routeMatchMetadata === undefined) {
      abort("Pipeline without route match metadata found.");
    }

    return addForAllMatchers(acc, routeMatchMetadata, pipeline);
  }, startAcc);
}

export function buildRouteTree(pipelines: Array<Pipeline<any, any>>) {
  return addForAllPipelines(pipelines);
}
