import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

async function runPrivateNetworkTest(
  allowPrivateNetwork: boolean,
  expected: Record<string, string>
) {
  await runCorsTest(
    { allowPrivateNetwork },
    { isPreflight: true },
    { headers: expected }
  );

  await runCorsTest(
    { allowPrivateNetwork },
    { isPreflight: false },
    { headers: { "access-control-allow-origin": "*" } }
  );
}

describe("cors private-network", () => {
  it("adds private-network header if configured", async () => {
    await runPrivateNetworkTest(true, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,HEAD,POST,PUT,PATCH,DELETE",
      "access-control-allow-private-network": "true",
    });
  });

  it("doesn't add private-network header if not configured", async () => {
    await runPrivateNetworkTest(false, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,HEAD,POST,PUT,PATCH,DELETE",
    });
  });
});
