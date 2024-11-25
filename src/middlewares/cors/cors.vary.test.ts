import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

describe("cors", () => {
  // TODO fix this
  it.skip("adds Vary header for specific origins", async () => {
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

  // TODO fix this
  it.skip("adds Vary header for wildcard origins with credentials", async () => {
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
});
