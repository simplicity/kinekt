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
});
