import {
  BasePipelineContext,
  Middleware,
} from "../../createPipeline/helpers/types";
import { matchOrigin } from "./helpers/matchOrigin";
import { normalizeParams } from "./helpers/normalizeParams";
import { reply } from "./helpers/reply";
import { CorsParams, NormalizedCorsParams } from "./helpers/types";
import { writeCredentialsHeader } from "./helpers/writeCredentialsHeader";
import { writeExposeHeadersHeader } from "./helpers/writeExposeHeadersHeader";
import { writeHeadersHeader } from "./helpers/writeHeadersHeader";
import { writeMaxAgeHeader } from "./helpers/writeMaxAgeHeader";
import { writeMethodsHeader } from "./helpers/writeMethodsHeader";
import { writeOriginHeader } from "./helpers/writeOriginHeader";
import { writePrivateNetworkHeader } from "./helpers/writePrivateNetworkHeader";
import { writeVaryHeader } from "./helpers/writeVaryHeader";

export type CorsMetadata = { type: "cors-metadata" };

export function isCorsMetadata(metadata: unknown): metadata is CorsMetadata {
  return (metadata as CorsMetadata)?.type === "cors-metadata";
}

export function corsMetadata(): CorsMetadata {
  return { type: "cors-metadata" };
}

function handle(
  context: BasePipelineContext,
  params: NormalizedCorsParams
): BasePipelineContext {
  const originHeader = context.request.getHeader("origin");

  if (!originHeader) {
    return context;
  }

  const isPreflight = context.request.method === "OPTIONS";

  if (!matchOrigin(originHeader, params.origins)) {
    if (isPreflight) {
      return reply(context, {}, isPreflight);
    } else {
      return context;
    }
  }

  const headers: Record<string, string> = {
    ...writeOriginHeader(params, originHeader),
    ...writeVaryHeader(params),
    ...writeCredentialsHeader(params),
    ...(isPreflight && writePrivateNetworkHeader(params)),
    ...(isPreflight && writeMethodsHeader(params, context)),
    ...(isPreflight && writeHeadersHeader(params, context)),
    ...(isPreflight && writeMaxAgeHeader(params)),
    ...(!isPreflight && writeExposeHeadersHeader(params)),
  };

  return reply(context, headers, isPreflight);
}

export const cors = <In extends BasePipelineContext, Out extends In>(
  params: CorsParams
): Middleware<In, Out> => {
  const normalizedCorsParams = normalizeParams(params);

  const middleware: Middleware<In, Out> = async (context) =>
    handle(context, normalizedCorsParams) as Out;

  middleware.executionMode = {
    type: "bypass-when-response-is-set",
    cb: async (context) => context as Out,
  };

  middleware.collectMetadata = () => [corsMetadata()];

  return middleware;
};
