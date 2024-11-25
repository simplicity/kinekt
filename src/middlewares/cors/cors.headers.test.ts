import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

async function runHeaderTest(
  allowHeaders: string[] | "ALL" | undefined,
  requestHeaders: string,
  expected: string
) {
  await runCorsTest(
    {
      origins: "*",
      allowHeaders,
    },
    {
      // TODO what about non-preflight?
      isPreflight: true,
      requestHeaders,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT,PATCH,DELETE,GET,HEAD,POST",
        "Access-Control-Allow-Headers": expected,
      },
    }
  );
}

describe("cors headers", () => {
  it("adds allowed headers", async () => {
    await runHeaderTest(["X-One", "X-Two"], "X-One, X-Two", "X-One,X-Two");
  });

  it("doesn't add headers when they aren't allowed", async () => {
    await runHeaderTest(["X-One"], "X-One, X-Two", "X-One");
  });

  it("adds all headers with allowHeaders set to ALL", async () => {
    await runHeaderTest("ALL", "X-One, X-Two", "X-One, X-Two"); // TODO shouldn't the space after , be gone?
  });
});
