import { describe, expect, it } from "vitest";
import { BasePipelineContext } from "../../createPipeline/helpers/types";
import { runCorsTest, runMiddleware } from "./helpers/testHelpers/runCorsTest";

function expectResponseUnset(result: BasePipelineContext) {
  expect(result.response).toEqual({ type: "unset" });
}

describe("cors origins", () => {
  it("allows matching origins", async () => {
    await runCorsTest(
      { origins: ["http://example.com", "http://foo.com"] },
      { origin: "http://example.com" },
      { headers: { "Access-Control-Allow-Origin": "http://example.com" } }
    );
  });

  it("denies non-matching origins", async () => {
    // TODO is this correct?
    expectResponseUnset(
      await runMiddleware(
        { origins: ["http://foo.com"] },
        { origin: "http://example.com" }
      )
    );
  });

  it("allows wildcard origins", async () => {
    await runCorsTest(
      { origins: "*" },
      { origin: "http://example.com" },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  });

  it("handles regex origins", async () => {
    await runCorsTest(
      { origins: [/example\.com$/, /foo\.com$/] },
      { origin: "http://sub.example.com" },
      { headers: { "Access-Control-Allow-Origin": "http://sub.example.com" } }
    );
  });
});
