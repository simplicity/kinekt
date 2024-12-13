import { BasePipelineContext, Middleware } from "./types";

export const noopMiddlewareSingleton: Middleware<BasePipelineContext> = async (
  context
) => context;

export const noopMiddleware = <
  In extends BasePipelineContext,
  Out extends In
>(): Middleware<In, Out> => {
  return noopMiddlewareSingleton as any as Middleware<In, Out>;
};
