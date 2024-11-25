import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

describe("cors", () => {
  it("sets Access-Control-Expose-Headers", async () => {
    await runCorsTest(
      { origins: "*", exposeHeaders: ["X-One", "X-Two"] },
      {},
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Expose-Headers": "X-One,X-Two",
        },
      }
    );
  });

  it("does not set Access-Control-Expose-Headers in preflight response", async () => {
    await runCorsTest(
      { origins: "*", exposeHeaders: ["X-One", "X-Two"] },
      { isPreflight: true },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "PUT,PATCH,DELETE,GET,HEAD,POST",
        },
      }
    );
  });
});
