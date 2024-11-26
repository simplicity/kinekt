import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

describe("cors", () => {
  it("sets Access-Control-Expose-Headers", async () => {
    await runCorsTest(
      { exposeHeaders: ["X-One", "X-Two"] },
      {},
      {
        headers: {
          "access-control-allow-origin": "*",
          "Access-Control-Expose-Headers": "X-One,X-Two",
        },
      }
    );
  });

  it("does not set Access-Control-Expose-Headers in preflight response", async () => {
    await runCorsTest(
      { exposeHeaders: ["X-One", "X-Two"] },
      { isPreflight: true },
      {
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET,HEAD,POST,PUT,PATCH,DELETE",
        },
      }
    );
  });
});
