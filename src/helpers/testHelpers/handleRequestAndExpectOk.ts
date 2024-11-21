import { expect } from "vitest";
import type { BasePipelineContext } from "../../createPipeline/helpers/types";
import type { HandleRequestParamsWithoutRouteTree } from "../../createRequestHandler/createRequestHandler";
import { handleRequest } from "../../createRequestHandler/createRequestHandler.test";

export async function handleRequestAndExpectOk<
  PipelineContext extends BasePipelineContext
>(params: HandleRequestParamsWithoutRouteTree): Promise<PipelineContext> {
  const result = await handleRequest(params);

  expect(result.type).toBe("ok");

  if (result.type === "error") {
    // Make the compiler happy
    throw new Error("Result from handleRequest call was 'error'.");
  }

  return result.value as PipelineContext;
}
