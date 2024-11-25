import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

describe("cors", () => {
  it("adds Vary header when multiple origins are configured", async () => {
    await runCorsTest(
      { origins: ["http://example.com", "http://foo.com"] },
      {},
      {
        headers: {
          "Access-Control-Allow-Origin": "http://example.com",
          Vary: "origin",
        },
      }
    );
  });

  it("doesn't add Vary header when only one origin is configured", async () => {
    await runCorsTest(
      { origins: ["http://example.com"] },
      {},
      {
        headers: {
          "Access-Control-Allow-Origin": "http://example.com",
        },
      }
    );
  });

  it("add Vary header when wildcard origin is configured and allowCredentials is set to true", async () => {
    await runCorsTest(
      { origins: "*", allowCredentials: true },
      {},
      {
        headers: {
          "Access-Control-Allow-Origin": "http://example.com",
          "Access-Control-Allow-Credentials": "true",
          Vary: "origin",
        },
      }
    );
  });

  it("doesn't add Vary header when wildcard origin is configured and allowCredentials is set to false", async () => {
    await runCorsTest(
      { origins: "*" },
      {},
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  });
});
