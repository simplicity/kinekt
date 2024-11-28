import {
  BasePipelineContext,
  Middleware,
} from "../../createPipeline/helpers/types";
import { actualReply } from "./helpers/actualReply";
import { matchOrigin } from "./helpers/matchOrigin";
import { normalizeParams } from "./helpers/normalizeParams";
import { preflightReply } from "./helpers/preflightReply";
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
  if (context.response.type === "set") {
    return context;
  }

  const isPreflight = context.request.method === "OPTIONS";

  const originHeader = context.request.getHeader("origin");

  if (originHeader === null) {
    return isPreflight ? preflightReply(context, {}) : context;
  }

  if (!matchOrigin(originHeader, params.origins)) {
    return isPreflight ? preflightReply(context, {}) : context;
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

  return isPreflight
    ? preflightReply(context, headers)
    : actualReply(context, headers);
}

export const cors = <In extends BasePipelineContext, Out extends In>(
  params: CorsParams
): Middleware<In, Out> => {
  const normalizedCorsParams = normalizeParams(params);

  const middleware: Middleware<In, Out> = async (context) =>
    handle(context, normalizedCorsParams) as Out;

  middleware.collectMetadata = () => [corsMetadata()];

  return middleware;
};
