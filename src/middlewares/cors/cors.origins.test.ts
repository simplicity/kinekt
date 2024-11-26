import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";
import { Origin } from "./helpers/types";

async function runOriginTest(
  origins: Origin[] | "*",
  origin: string | undefined,
  expected: string
) {
  // TODO maybe re-use the same code that is used in the implementation to determine this
  const vary =
    origins === "*" || origins.length === 1 ? undefined : { Vary: "origin" };

  await runCorsTest(
    { origins },
    {
      isPreflight: true,
      ...(origin ? { origin } : {}),
    },
    {
      headers: {
        "Access-Control-Allow-Methods": "GET,HEAD,POST,PUT,PATCH,DELETE",
        "Access-Control-Allow-Origin": expected,
        ...vary,
      },
    }
  );

  await runCorsTest(
    { origins },
    { ...(origin ? { origin } : {}) },
    {
      headers: {
        "Access-Control-Allow-Origin": expected,
        ...vary,
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
