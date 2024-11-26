import { describe, it } from "vitest";
import { IGNORE_HEADER, runCorsTest } from "./helpers/testHelpers/runCorsTest";
import { CorsParams, Origin } from "./helpers/types";

async function runOriginTest(
  origins: CorsParams["origins"],
  origin: string | undefined,
  expected: string
) {
  await runCorsTest(
    { origins },
    {
      isPreflight: true,
      ...(origin ? { origin } : {}),
    },
    {
      headers: {
        "access-control-allow-methods": "GET,HEAD,POST,PUT,PATCH,DELETE",
        "access-control-allow-origin": expected,
        vary: IGNORE_HEADER,
      },
    }
  );

  await runCorsTest(
    { origins },
    { ...(origin ? { origin } : {}) },
    {
      headers: {
        "access-control-allow-origin": expected,
        vary: IGNORE_HEADER,
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
