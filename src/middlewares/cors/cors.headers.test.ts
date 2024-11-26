import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

async function runHeaderTest(
  allowHeaders: string[] | "ALL" | undefined,
  requestHeaders: string | null,
  expected: string | null
) {
  await runCorsTest(
    { allowHeaders },
    { isPreflight: true, ...(requestHeaders ? { requestHeaders } : {}) },
    {
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,HEAD,POST,PUT,PATCH,DELETE",
        ...(expected ? { "access-control-allow-headers": expected } : {}),
      },
    }
  );

  await runCorsTest(
    { allowHeaders },
    { ...(requestHeaders ? { requestHeaders } : {}) },
    { headers: { "access-control-allow-origin": "*" } }
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
