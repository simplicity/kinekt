import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

async function runHeaderTest(
  allowHeaders: string[] | "ALL" | undefined,
  requestHeaders: string | null,
  expected: string | null
) {
  await runCorsTest(
    { origins: "*", allowHeaders },
    { isPreflight: true, ...(requestHeaders ? { requestHeaders } : {}) },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,PUT,PATCH,DELETE",
        ...(expected ? { "Access-Control-Allow-Headers": expected } : {}),
      },
    }
  );
}

describe("cors headers", () => {
  it("lists all the headers that have been configured regardless of the request header", async () => {
    await runHeaderTest(
      ["X-One", "X-Two", "X-Three"],
      "X-One, X-Two, X-Four",
      "X-One,X-Two,X-Three"
    );
  });

  it("mirrors the request header when ALL is configured", async () => {
    await runHeaderTest("ALL", "whatever", "whatever");
  });

  it("doesn't list anything if request header isn't sent", async () => {
    await runHeaderTest("ALL", null, null);
  });
});
