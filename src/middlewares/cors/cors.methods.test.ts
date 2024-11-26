import { describe, it } from "vitest";
import { Method } from "../../helpers/types";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

async function runMethodTest(
  allowMethods: "ALL" | Array<Method> | undefined,
  requestMethod: Method | null,
  expected: string | null
) {
  await runCorsTest(
    { ...(allowMethods ? { allowMethods } : {}) },
    {
      isPreflight: true,
      requestMethod,
    },
    {
      headers: {
        "access-control-allow-origin": "*",
        ...(expected === null
          ? {}
          : { "access-control-allow-methods": expected }),
      },
    }
  );
}

describe("cors methods", () => {
  it("lists all valid http method by default if no configuration is given", async () => {
    await runMethodTest(undefined, "PUT", "GET,HEAD,POST,PUT,PATCH,DELETE");
  });

  it("lists configured methods and defaults if configuration is given", async () => {
    await runMethodTest(["PUT", "PATCH"], "PUT", "GET,HEAD,POST,PUT,PATCH");
  });

  it("doesn't list anything if request header isn't sent", async () => {
    await runMethodTest(["PUT", "PATCH"], null, null);
  });

  it("allows all methods with allowMethods set to ALL", async () => {
    await runMethodTest("ALL", "ANYMETHOD" as any, "ANYMETHOD");
  });
});
