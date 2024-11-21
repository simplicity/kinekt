import type { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { FinalizeContextExtension } from "../../finalize/helpers/types";

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
