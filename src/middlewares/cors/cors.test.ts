import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

describe("cors", () => {
  // TODO ?
  it.skip("does nothing for non-CORS requests", async () => {
    await runCorsTest({ origins: "*" }, {}, { headers: {} });
  });

  // TODO ?
  it.skip("sets headers for non-CORS requests if passthroughNonCorsRequests is true", async () => {
    await runCorsTest(
      { origins: "*", passthroughNonCorsRequests: true },
      { origin: undefined },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  });
});
