import { type BasePipelineContext, type Middleware } from "./types";

function maybeWriteError(
  context: BasePipelineContext,
  error: unknown
): BasePipelineContext {
  return context.error.type === "error"
    ? context
    : { ...context, error: { type: "error", error } };
}

export async function process<T extends BasePipelineContext>(
  input: T,
  middlewares: Array<Middleware<BasePipelineContext, BasePipelineContext>>,
  currentIndex: number
): Promise<BasePipelineContext> {
  const middleware = middlewares.at(currentIndex);

  if (middleware === undefined) {
    return input;
  }

  if (
    (input.response.type === "set" || input.error.type === "error") &&
    middleware.alwaysRun !== true
  ) {
    return process(input, middlewares, currentIndex + 1);
  }

  return middleware(input)
    .then((newContext) => process(newContext, middlewares, currentIndex + 1))
    .catch((newError) =>
      process(maybeWriteError(input, newError), middlewares, currentIndex + 1)
    );
}
