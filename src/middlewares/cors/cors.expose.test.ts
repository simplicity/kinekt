import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

describe("cors", () => {
  it("sets Access-Control-Expose-Headers", async () => {
    await runCorsTest(
      { origins: "*", exposeHeaders: ["X-Foo", "X-Bar"] },
      { origin: "http://example.com" },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Expose-Headers": "X-Foo,X-Bar",
        },
      }
    );
  });
});
