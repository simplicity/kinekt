import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

describe("cors allow-credentials", () => {
  it("sets Access-Control-Allow-Credentials when allowCredentials is true, and also sets the vary header", async () => {
    await runCorsTest(
      { origins: "*", allowCredentials: true },
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

  it("does not set Access-Control-Allow-Credentials when allowCredentials is false, and doesn't set the vary header", async () => {
    await runCorsTest(
      { origins: "*", allowCredentials: false },
      {},
      { headers: { "access-control-allow-origin": "*" } }
    );
  });
});
