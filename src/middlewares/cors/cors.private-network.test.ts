import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

describe("cors private-network", () => {
  it("adds private-network header if configured", async () => {
    await runCorsTest(
      { allowPrivateNetwork: true },
      { isPreflight: true },
      {
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET,HEAD,POST,PUT,PATCH,DELETE",
          "access-control-allow-private-network": "true",
        },
      }
    );
  });

  it("doesn't add private-network header if not configured", async () => {
    await runCorsTest(
      { allowPrivateNetwork: false },
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
