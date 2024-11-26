import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";
import { CorsParams } from "./helpers/types";

async function runVaryTest(
  origins: CorsParams["origins"],
  allowCredentials: boolean,
  expected: Record<string, string>
) {
  await runCorsTest({ origins, allowCredentials }, {}, { headers: expected });

  await runCorsTest(
    { origins, allowCredentials },
    { isPreflight: true },
    {
      headers: {
        ...expected,
        "access-control-allow-methods": "GET,HEAD,POST,PUT,PATCH,DELETE",
      },
    }
  );
}

describe("cors vary", () => {
  it("adds vary header when multiple origins are configured", async () => {
    await runVaryTest(["http://example.com", "http://foo.com"], false, {
      "access-control-allow-origin": "http://example.com",
      vary: "origin",
    });
  });

  it("doesn't add vary header when only one origin is configured", async () => {
    await runVaryTest(["http://example.com"], false, {
      "access-control-allow-origin": "http://example.com",
    });
  });

  it("add vary header when wildcard origin is configured and allowCredentials is set to true", async () => {
    await runVaryTest("*", true, {
      "access-control-allow-origin": "http://example.com",
      "access-control-allow-credentials": "true",
      vary: "origin",
    });
  });

  it("doesn't add vary header when wildcard origin is configured and allowCredentials is set to false", async () => {
    await runVaryTest("*", false, { "access-control-allow-origin": "*" });
  });
});
