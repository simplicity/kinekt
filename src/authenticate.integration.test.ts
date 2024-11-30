import { afterEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { getHtml } from "./createValidatedEndpointFactory/helpers/testHelpers/getHtml";
import { createTestContext } from "./helpers/testHelpers/createTestContext";
import { FinalizedResponse } from "./middlewares/finalize/helpers/types";

async function runAuthenticateIntegrationTest(
  authorize: boolean,
  expected: FinalizedResponse
) {
  const result = await getHtml.pipeline(
    createTestContext({
      requestHeaders: authorize ? { authorization: "" } : {},
      metadata: getHtml.pipeline.collectMetadata(),
    })
  );

  expect(result.finalizedResponse).toEqual(expected);
}

describe("authenticate", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns 401 if not authorized", async () => {
    await runAuthenticateIntegrationTest(false, {
      type: "ok",
      body: { error: "Unauthorized" },
      statusCode: 401,
      headers: { "content-type": "text/html" },
    });
  });

  it("returns 200 if authorized", async () => {
    await runAuthenticateIntegrationTest(true, {
      type: "ok",
      body: "<h1>hello world</h1>",
      statusCode: 200,
      headers: { "content-type": "text/html" },
    });
  });
});
