import { expect } from "vitest";
import { createTestContext } from "../../../../helpers/testHelpers/createTestContext";
import { cors } from "../../cors";
import { CorsParams } from "../types";

type RunMiddlewareParams = {
  origin?: string;
  isPreflight?: boolean;
  requestMethod?: string;
  requestHeaders?: string;
};

// TODO dont export
export async function runMiddleware(
  corsParams: CorsParams,
  params: RunMiddlewareParams
) {
  const mw = cors(corsParams);

  const context = createTestContext({
    ...(params.isPreflight ? { method: "OPTIONS" as any } : {}), // TODO avoid any
    requestHeaders: {
      "Access-Control-Request-Method": params.requestMethod ?? "PUT",
      Origin: params.origin ?? "http://example.com",
      ...(params.requestHeaders
        ? { "Access-Control-Request-Headers": params.requestHeaders }
        : {}),
    },
  });

  return mw(context);
}

export async function runCorsTest(
  corsParams: CorsParams,
  params: RunMiddlewareParams,
  expectation: { headers: Record<string, string> }
) {
  const result = await runMiddleware(corsParams, params);

  expect(result.response).toEqual({
    type: "set",
    statusCode: 200,
    body: null,
    headers: expectation.headers,
  });
}
