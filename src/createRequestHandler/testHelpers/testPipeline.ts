import { createPipeline } from "../../createPipeline/createPipeline";
import type { BasePipelineContext } from "../../createPipeline/types";
import {
  basicEndpoint,
  type BasicEndpointParams,
} from "../../helpers/testHelpers/basicEndpoint";
import { checkAcceptHeader } from "../../middlewares/checkAcceptHeader/checkAcceptHeader";
import { CheckAcceptHeaderContextExtension } from "../../middlewares/checkAcceptHeader/types";
import { deserialize } from "../../middlewares/deserialize/deserialize";
import type { DeserializeContextExtension } from "../../middlewares/deserialize/types";
import { finalize } from "../../middlewares/finalize/finalize";
import { serialize } from "../../middlewares/serialize/serialize";
import { HasPipeline } from "../../types";

export function createTestPipeline<
  PipelineContext extends BasePipelineContext &
    DeserializeContextExtension &
    CheckAcceptHeaderContextExtension
>(params: BasicEndpointParams<PipelineContext>): HasPipeline {
  return {
    pipeline: createPipeline(
      checkAcceptHeader(),
      deserialize(),
      basicEndpoint(params),
      serialize(),
      finalize()
    ),
  };
}
