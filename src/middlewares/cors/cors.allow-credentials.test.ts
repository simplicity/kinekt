import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

describe("cors allow-credentials", () => {
  it("sets Access-Control-Allow-Credentials when allowCredentials is true", async () => {
    await runCorsTest(
      { origins: "*", allowCredentials: true },
      {},
      {
        headers: {
          "Access-Control-Allow-Origin": "http://example.com",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  });

  it("does not set Access-Control-Allow-Credentials when allowCredentials is false", async () => {
    await runCorsTest(
      { origins: "*", allowCredentials: false },
      {},
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  });
});
