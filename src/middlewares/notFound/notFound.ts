import type {
  BasePipelineContext,
  Middleware,
} from "../../createPipeline/helpers/types";
import {
  RouteMatchMatcher,
  routeMatchMetadata,
} from "../../helpers/routeMatch";
import { FinalizeContextExtension } from "../finalize/helpers/types";
import { reply } from "./helpers/reply";

export const notFound = <
  In extends BasePipelineContext,
  Out extends In & FinalizeContextExtension
>(
  ...paths: Array<string>
): Middleware<In, Out> => {
  const middleware: Middleware<In, Out> = async (context) =>
    reply(context) as Out;

  middleware.executionMode = {
    type: "always-run",
  };

  paths = paths.length === 0 ? ["/"] : paths;

  middleware.collectMetadata = () => [
    routeMatchMetadata(
      paths.reduce(
        (acc, path) => [
          ...acc,
          ...(path === "/"
            ? [
                {
                  method: "ANY" as const,
                  path: "/**",
                },
              ]
            : [
                {
                  method: "ANY" as const,
                  path: `/${path.replace(/^\//, "").replace(/\/$/, "")}`,
                },
                {
                  method: "ANY" as const,
                  path: `/${path.replace(/^\//, "").replace(/\/$/, "")}/**`,
                },
              ]),
        ],
        new Array<RouteMatchMatcher>()
      )
    ),
  ];

  return middleware;
};
