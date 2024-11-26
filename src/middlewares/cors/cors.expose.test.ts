import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";
import { CorsParams } from "./helpers/types";

async function runExposeTest(
  exposeHeaders: CorsParams["exposeHeaders"],
  isPreflight: boolean,
  expected: Record<string, string>
) {
  await runCorsTest({ exposeHeaders }, { isPreflight }, { headers: expected });
}

describe("cors", () => {
  it("sets access-control-expose-headers", async () => {
    await runExposeTest(["X-One", "X-Two"], false, {
      "access-control-allow-origin": "*",
      "access-control-expose-headers": "X-One,X-Two",
    });
  });

  it("does not set access-control-expose-headers in preflight response", async () => {
    await runExposeTest(["X-One", "X-Two"], true, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,HEAD,POST,PUT,PATCH,DELETE",
    });
  });
});
