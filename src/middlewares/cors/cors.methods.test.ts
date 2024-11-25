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
      origin: "http://example.com",
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
  it("adds methods allowed by default to Access-Control-Allow-Methods", async () => {
    await runMethodTest(undefined, "PUT", "PUT,PATCH,DELETE,GET,HEAD,POST");
  });

  it("adds allowed methods to Access-Control-Allow-Methods", async () => {
    await runMethodTest(["PUT", "PATCH"], "PUT", "PUT,PATCH,GET,HEAD,POST");
  });

  it("doesn't add methods to Access-Control-Allow-Methods when they aren't allowed", async () => {
    await runMethodTest(["GET"], "PUT", "GET,HEAD,POST");
  });

  it("allows all methods with allowMethods set to ALL", async () => {
    // TODO is this really correct?
    await runMethodTest("ALL", "ANYMETHOD" as any, "ANYMETHOD");
  });
});