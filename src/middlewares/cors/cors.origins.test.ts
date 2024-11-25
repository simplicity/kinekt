import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";
import { Origin } from "./helpers/types";

async function runOriginTest(
  origins: Origin[] | "*",
  origin: string | undefined,
  expected: string
) {
  await runCorsTest(
    { origins },
    {
      // TODO what about non-preflight?
      isPreflight: true,
      ...(origin ? { origin } : {}),
    },
    {
      headers: {
        "Access-Control-Allow-Methods": "PUT,PATCH,DELETE,GET,HEAD,POST",
        "Access-Control-Allow-Origin": expected,
      },
    }
  );
}

describe("cors origins", () => {
  it("adds allowed origin", async () => {
    await runOriginTest(
      ["http://example.com", "http://beispiel.com"],
      undefined,
      "http://example.com"
    );
  });

  it("doesn't add origin when it isn't allowed", async () => {
    await runCorsTest(
      { origins: ["http://beispiel.com"] },
      { isPreflight: true },
      { headers: {} }
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
