import { afterEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { getHtml } from "./createValidatedEndpointFactory/helpers/testHelpers/getHtml";
import { createTestContext } from "./helpers/testHelpers/createTestContext";
import { FinalizedResponse } from "./middlewares/finalize/helpers/types";

async function runCorsIntegrationTest(
  origin: string,
  isPreflight: boolean,
  expected: FinalizedResponse
) {
  const result = await getHtml.pipeline(
    createTestContext({
      ...(isPreflight ? { method: "OPTIONS" } : {}),
      requestHeaders: { authorization: "", origin },
      metadata: getHtml.pipeline.collectMetadata(),
    })
  );

  expect(result.finalizedResponse).toEqual(expected);
}

describe("cors", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns a preflight response indicating valid origin if origin is valid", async () => {
    await runCorsIntegrationTest("http://example.com", true, {
      type: "ok",
      body: "",
      statusCode: 200,
      headers: {
        "access-control-allow-origin": "http://example.com",
        "content-type": "text/plain",
      },
    });
  });

  it("returns a preflight response indicating invalid origin if origin is invalid", async () => {
    await runCorsIntegrationTest("http://beispiel.com", true, {
      type: "ok",
      body: "",
      statusCode: 200,
      headers: { "content-type": "text/plain" },
    });
  });

  it("returns a response with cors headers if origin is valid", async () => {
    await runCorsIntegrationTest("http://example.com", false, {
      type: "ok",
      body: "<h1>hello world</h1>",
      statusCode: 200,
      headers: {
        "access-control-allow-origin": "http://example.com",
        "content-type": "text/html",
      },
    });
  });

  it("returns a response without cors headers if origin is invalid", async () => {
    await runCorsIntegrationTest("http://beispiel.com", false, {
      type: "ok",
      body: "<h1>hello world</h1>",
      statusCode: 200,
      headers: {
        "content-type": "text/html",
      },
    });
  });
});
