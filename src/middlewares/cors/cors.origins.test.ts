import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";
import { Origin } from "./helpers/types";

async function runOriginTest(
  origins: Origin[] | "*",
  origin: string | undefined,
  expected: string
) {
  // TODO what about preflight?
  await runCorsTest({ origins }, origin ? { origin } : {}, {
    headers: { "Access-Control-Allow-Origin": expected },
  });
}

describe("cors origins", () => {
  it("adds allowed origin", async () => {
    await runOriginTest(
      ["http://example.com", "http://beispiel.com"],
      undefined,
      "http://example.com"
    );
  });

  // TODO fix
  it.skip("doesn't add origin when it isn't allowed", async () => {
    await runOriginTest(
      ["http://beispiel.com"],
      undefined,
      "http://example.com"
    );
  });

  it("allows wildcard origins", async () => {
    await runOriginTest("*", undefined, "*");
  });

  it("handles regex origins", async () => {
    await runOriginTest(
      [/example\.com$/, /foo\.com$/],
      "http://sub.example.com",
      "http://sub.example.com"
    );
  });
});
