import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

describe("cors vary", () => {
  it("adds vary header when multiple origins are configured", async () => {
    await runCorsTest(
      { origins: ["http://example.com", "http://foo.com"] },
      {},
      {
        headers: {
          "access-control-allow-origin": "http://example.com",
          vary: "origin",
        },
      }
    );
  });

  it("doesn't add vary header when only one origin is configured", async () => {
    await runCorsTest(
      { origins: ["http://example.com"] },
      {},
      {
        headers: {
          "access-control-allow-origin": "http://example.com",
        },
      }
    );
  });

  it("add vary header when wildcard origin is configured and allowCredentials is set to true", async () => {
    await runCorsTest(
      { allowCredentials: true },
      {},
      {
        headers: {
          "access-control-allow-origin": "http://example.com",
          "Access-Control-Allow-Credentials": "true",
          vary: "origin",
        },
      }
    );
  });

  it("doesn't add vary header when wildcard origin is configured and allowCredentials is set to false", async () => {
    await runCorsTest(
      {},
      {},
      { headers: { "access-control-allow-origin": "*" } }
    );
  });
});
