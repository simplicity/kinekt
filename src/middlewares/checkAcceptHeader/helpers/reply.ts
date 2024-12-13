import type {
  BasePipelineContext,
  BasePipelineContextResponseSet,
} from "../../../createPipeline/helpers/types";

export function reply(
  context: BasePipelineContext,
  response: BasePipelineContextResponseSet | null
): BasePipelineContext {
  return {
    ...context,
    ...(response
      ? {
          response: {
            ...response,
            headers: {
              ...(context.response.type === "partially-set"
                ? context.response.headers
                : {}),
              ...response.headers,
            },
          },
        }
      : {}),
  };
}
