import type {
  BasePipelineContext,
  BasePipelineContextResponse,
  BasePipelineContextResponseSet,
  Middleware,
} from "../../createPipeline/helpers/types";
import { checkAcceptHeaderMetadata } from "../../middlewares/checkAcceptHeader/helpers/metadata";
import { CheckAcceptHeaderContextExtension } from "../../middlewares/checkAcceptHeader/helpers/types";
import type { DeserializeContextExtension } from "../../middlewares/deserialize/helpers/types";
import type { MimeType } from "../MimeType";
import { routeMatchMetadata } from "../routeMatch";
import type { Method } from "../types";

type BasicEndpointParamsCb<PipelineContext> = (
  context: PipelineContext
) => Promise<BasePipelineContextResponseSet>;

export type BasicEndpointParams<
  PipelineContext extends BasePipelineContext &
    DeserializeContextExtension &
    CheckAcceptHeaderContextExtension
> = {
  method: Method;
  path: string;
  mimeType: MimeType;
  cb: BasicEndpointParamsCb<PipelineContext>;
};

function reply(
  context: BasePipelineContext,
  response: BasePipelineContextResponse
): BasePipelineContext {
  return { ...context, response };
}

export const basicEndpoint = <
  PipelineContext extends BasePipelineContext &
    DeserializeContextExtension &
    CheckAcceptHeaderContextExtension
>(
  params: BasicEndpointParams<PipelineContext>
): Middleware<PipelineContext, PipelineContext> => {
  const middleware: Middleware<PipelineContext, PipelineContext> = async (
    context
  ) => reply(context, await params.cb(context)) as PipelineContext;

  middleware.collectMetadata = () => [
    routeMatchMetadata([{ method: params.method, path: params.path }]),
    checkAcceptHeaderMetadata([params.mimeType]),
  ];

  return middleware;
};
