import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

async function runHeaderTest(
  allowHeaders: string[] | "ALL" | undefined,
  requestHeaders: string,
  expected: string
) {
  await runCorsTest(
    { origins: "*", allowHeaders },
    { isPreflight: true, requestHeaders },
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
  it("allows headers if configured", async () => {
    await runHeaderTest(["X-One", "X-Two"], "X-One, X-Two", "X-One,X-Two");
  });

  it("doesn't allow headers if not configured", async () => {
    await runHeaderTest(["X-One"], "X-One, X-Two", "X-One");
  });

  it("allows all headers if allowHeaders is set to ALL", async () => {
    await runHeaderTest("ALL", "X-One,X-Two", "X-One,X-Two");
  });
});
