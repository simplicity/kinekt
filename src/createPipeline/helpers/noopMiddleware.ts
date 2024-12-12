import { BasePipelineContext, Middleware } from "./types";

export const noopMw: Middleware<BasePipelineContext> = async (context) =>
  context;
