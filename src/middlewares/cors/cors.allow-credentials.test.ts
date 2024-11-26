import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

async function runAllowCredentialsTest(
  allowCredentials: boolean,
  expected: Record<string, string>
) {
  await runCorsTest({ allowCredentials }, {}, { headers: expected });

  await runCorsTest(
    { allowCredentials },
    { isPreflight: true },
    {
      headers: {
        ...expected,
        "access-control-allow-methods": "GET,HEAD,POST,PUT,PATCH,DELETE",
      },
    }
  );
}

describe("cors allow-credentials", () => {
  it("sets Access-Control-Allow-Credentials when allowCredentials is true, and also sets the vary header", async () => {
    await runAllowCredentialsTest(true, {
      "access-control-allow-origin": "http://example.com",
      "Access-Control-Allow-Credentials": "true",
      vary: "origin",
    });
  });

  it("does not set Access-Control-Allow-Credentials when allowCredentials is false, and doesn't set the vary header", async () => {
    await runAllowCredentialsTest(false, {
      "access-control-allow-origin": "*",
    });
  });
});
