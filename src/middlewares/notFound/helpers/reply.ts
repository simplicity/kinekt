import type { BasePipelineContext } from "../../../createPipeline/types";
import { FinalizeContextExtension } from "../../finalize/types";

export function reply(
  context: BasePipelineContext
): BasePipelineContext & FinalizeContextExtension {
  return {
    ...context,
    finalizedResponse: {
      type: "ok",
      body: null,
      statusCode: 404,
      headers: {},
    },
  };
}
