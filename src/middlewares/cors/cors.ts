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

function handle(
  context: BasePipelineContext,
  params: NormalizedCorsParams
): BasePipelineContext {
  // TODO how to deal with upper/lower case in headers?
  const originHeader = context.request.getHeader("Origin");

  if (!originHeader) {
    // TODO what to do here?
    // if (passthroughNonCorsRequests) return false;
    // return true;

    return context;
  }

  const isPreflight =
    // TODO avoid cast
    (context.request.method as "OPTIONS") === "OPTIONS";

  if (!matchOrigin(originHeader, params.origins)) {
    if (isPreflight) {
      return reply(context, {});
    }

    return context;
  }

  const headers: Record<string, string> = {
    ...writeOriginHeader(params, originHeader),
    ...writeVaryHeader(params),
    ...writeCredentialsHeader(params),
    ...(isPreflight && writePrivateNetworkHeader(params, context)),
    ...(isPreflight && writeMethodsHeader(params, context)),
    ...(isPreflight && writeHeadersHeader(params, context)),
    ...(isPreflight && writeMaxAgeHeader(params)),
    ...(!isPreflight && writeExposeHeadersHeader(params)),
  };

  // TODO add tests for non-preflights
  return reply(context, headers);
}

export const cors = <In extends BasePipelineContext, Out extends In>(
  params: CorsParams
): Middleware<In, Out> => {
  const normalizedCorsParams = normalizeParams(params);

  const middleware: Middleware<In, Out> = async (context) =>
    handle(context, normalizedCorsParams) as Out;

  return middleware;
};
