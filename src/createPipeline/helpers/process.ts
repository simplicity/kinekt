import { type BasePipelineContext, type Middleware } from "./types";

function maybeWriteError(
  context: BasePipelineContext,
  error: unknown
): BasePipelineContext {
  return context.error.type === "error"
    ? context
    : { ...context, error: { type: "error", error } };
}

export async function process(
  context: BasePipelineContext,
  middlewares: Array<Middleware<BasePipelineContext, BasePipelineContext>>,
  currentIndex: number
): Promise<BasePipelineContext> {
  const middleware = middlewares.at(currentIndex);

  if (middleware === undefined) {
    return context;
  }

  if (context.error.type === "error" && middleware.alwaysRun !== true) {
    return process(context, middlewares, currentIndex + 1);
  }

  return middleware(context)
    .then((newContext) => process(newContext, middlewares, currentIndex + 1))
    .catch((newError) =>
      process(maybeWriteError(context, newError), middlewares, currentIndex + 1)
    );
}
