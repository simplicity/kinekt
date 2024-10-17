import { expect } from "vitest";
import type { BasePipelineContext } from "../../createPipeline/types";
import { FinalizeContextExtension } from "../../middlewares/finalize/types";
import type { StatusCode } from "../../types";

export function expectStatusCode(
  context: BasePipelineContext & FinalizeContextExtension,
  statusCode: StatusCode
) {
  expect(context.finalizedResponse.statusCode).toEqual(statusCode);
}
