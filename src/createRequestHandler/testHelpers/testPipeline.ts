import { createPipeline } from "../../createPipeline/createPipeline";
import type { BasePipelineContext } from "../../createPipeline/helpers/types";
import {
  basicEndpoint,
  type BasicEndpointParams,
} from "../../helpers/testHelpers/basicEndpoint";
import { HasPipeline } from "../../helpers/types";
import { checkAcceptHeader } from "../../middlewares/checkAcceptHeader/checkAcceptHeader";
import { CheckAcceptHeaderContextExtension } from "../../middlewares/checkAcceptHeader/helpers/types";
import { deserialize } from "../../middlewares/deserialize/deserialize";
import type { DeserializeContextExtension } from "../../middlewares/deserialize/helpers/types";
import { finalize } from "../../middlewares/finalize/finalize";
import { serialize } from "../../middlewares/serialize/serialize";

export function createTestPipeline<
  PipelineContext extends BasePipelineContext &
    DeserializeContextExtension &
    CheckAcceptHeaderContextExtension
>(params: BasicEndpointParams<PipelineContext>): HasPipeline {
  return {
    pipeline: createPipeline(
      checkAcceptHeader(), // TODO when commenting this, we should get an error for serialize()
      deserialize(),
      basicEndpoint(params),
      serialize(),
      finalize()
    ),
  };
}
