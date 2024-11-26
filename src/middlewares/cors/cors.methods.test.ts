import { describe, it } from "vitest";
import { Method } from "../../helpers/types";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

async function runMethodTest(
  allowMethods: "ALL" | Array<Method> | undefined,
  requestMethod: Method,
  expected: string
) {
  await runCorsTest(
    { origins: "*", ...(allowMethods ? { allowMethods } : {}) },
    {
      isPreflight: true,
      requestMethod,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": expected,
      },
    }
  );
}

describe("cors methods", () => {
  it("allows methods by default", async () => {
    await runMethodTest(undefined, "PUT", "GET,HEAD,POST,PUT,PATCH,DELETE");
  });

  it("allows methods if configured", async () => {
    await runMethodTest(["PUT", "PATCH"], "PUT", "GET,HEAD,POST,PUT,PATCH");
  });

  it("doesn't allow methods if not configured", async () => {
    await runMethodTest(["GET"], "PUT", "GET,HEAD,POST");
  });

  it("allows all methods with allowMethods set to ALL", async () => {
    // TODO is this really correct?
    await runMethodTest("ALL", "ANYMETHOD" as any, "ANYMETHOD");
  });
});
