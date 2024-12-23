import { expect } from "vitest";
import { createTestContext } from "../../../../helpers/testHelpers/createTestContext";
import { Method } from "../../../../helpers/types";
import { cors } from "../../cors";
import { CorsParams } from "../types";

export const IGNORE_HEADER = "<ignore-header>";

function mirrorIgnoredHeader(
  source: Record<string, string>,
  target: Record<string, string>
) {
  return Object.entries(target).reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...(value === IGNORE_HEADER ? { [key]: source[key] } : { [key]: value }),
    }),
    {} satisfies Record<string, string>
  );
}

type RunMiddlewareParams = {
  origin?: string;
  isPreflight?: boolean;
  requestMethod?: Method | null;
  requestHeaders?: string;
};

async function runMiddleware(
  corsParams: CorsParams,
  params: RunMiddlewareParams
) {
  const mw = cors(corsParams);

  const context = createTestContext({
    ...(params.isPreflight ? { method: "OPTIONS" } : {}),
    requestHeaders: {
      ...(params.requestMethod === null
        ? {}
        : { "access-control-request-method": params.requestMethod ?? "PUT" }),
      origin: params.origin ?? "http://example.com",
      ...(params.requestHeaders
        ? { "access-control-request-headers": params.requestHeaders }
        : {}),
    },
  });

  return mw(context);
}

export async function runCorsTest(
  corsParams: Omit<CorsParams, "origins"> & { origins?: CorsParams["origins"] },
  params: RunMiddlewareParams,
  expectation: { headers: Record<string, string> }
) {
  const result = await runMiddleware(
    {
      origins: "*",
      ...corsParams,
    },
    params
  );

  expect(result.response).toEqual({
    ...(params.isPreflight
      ? { type: "set", statusCode: 200, body: null }
      : { type: "partially-set" }),
    headers: mirrorIgnoredHeader(
      result.response.type !== "unset" ? result.response.headers : {},
      expectation.headers
    ),
  });
}
