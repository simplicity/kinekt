import { afterEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { getHtml } from "./createSchematizedEndpointFactory/helpers/testHelpers/getHtml";
import { TestSession } from "./createSchematizedEndpointFactory/helpers/testHelpers/testSetup";
import { createTestContext } from "./helpers/testHelpers/createTestContext";
import { FinalizedResponse } from "./middlewares/finalize/helpers/types";

async function runAuthenticateIntegrationTest(
  authorize: boolean,
  expectedResponse: FinalizedResponse,
  expectedSession: TestSession | null
) {
  const result = await getHtml.pipeline(
    createTestContext({
      requestHeaders: authorize ? { authorization: "" } : {},
      metadata: getHtml.pipeline.collectMetadata(),
    })
  );

  expect(result.session).toEqual(expectedSession);
  expect(result.finalizedResponse).toEqual(expectedResponse);
}

describe("authenticate", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns 401 if not authorized", async () => {
    await runAuthenticateIntegrationTest(
      false,
      {
        type: "ok",
        body: "Authentication failed",
        statusCode: 401,
        headers: { "content-type": "text/plain" },
      },
      null
    );
  });

  it("returns 200 if authorized", async () => {
    await runAuthenticateIntegrationTest(
      true,
      {
        type: "ok",
        body: "<h1>hello world</h1>",
        statusCode: 200,
        headers: { "content-type": "text/html" },
      },
      { user: { email: "" } }
    );
  });
});
