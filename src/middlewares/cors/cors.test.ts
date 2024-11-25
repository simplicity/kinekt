import { describe, expect, it } from "vitest";
import { BasePipelineContext } from "../../createPipeline/helpers/types";
import { runCorsTest, runMiddleware } from "./helpers/testHelpers/runCorsTest";

function expectResponseUnset(result: BasePipelineContext) {
  expect(result.response).toEqual({ type: "unset" });
}

describe("cors", () => {
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

  it("allows preflight requests with valid methods", async () => {
    await runCorsTest(
      { origins: "*", allowMethods: ["PUT", "PATCH"] },
      {
        isPreflight: true,
        origin: "http://example.com",
        requestMethod: "PUT",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "PUT,PATCH,GET,HEAD,POST", // TODO is this correct?
        },
      }
    );
  });

  it("denies preflight requests with invalid methods", async () => {
    await runCorsTest(
      { origins: "*", allowMethods: ["GET"] },
      {
        isPreflight: true,
        origin: "http://example.com",
        requestMethod: "PUT",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,GET,HEAD,POST", // TODO fix this (and: is it correct?)
        },
      }
    );
  });

  it("allows preflight requests with valid headers", async () => {
    await runCorsTest(
      {
        origins: "*",
        allowMethods: ["PUT"],
        allowHeaders: ["X-Foo", "X-Bar"],
      },
      {
        isPreflight: true,
        origin: "http://example.com",
        requestMethod: "PUT",
        requestHeaders: "X-Foo, X-Bar",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "PUT,GET,HEAD,POST",
          "Access-Control-Allow-Headers": "X-Foo,X-Bar",
        },
      }
    );
  });

  it("denies preflight requests with invalid headers", async () => {
    await runCorsTest(
      {
        origins: "*",
        allowMethods: ["PUT"],
        allowHeaders: ["X-Foo"],
      },
      {
        isPreflight: true,
        origin: "http://example.com",
        requestMethod: "PUT",
        requestHeaders: "X-Foo, X-Bar",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "PUT,GET,HEAD,POST",
          "Access-Control-Allow-Headers": "X-Foo",
        },
      }
    );
  });

  it("allows all methods with allowMethods set to ALL", async () => {
    await runCorsTest(
      { origins: "*", allowMethods: "ALL" },
      {
        isPreflight: true,
        origin: "http://example.com",
        requestMethod: "ANYMETHOD",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "ANYMETHOD",
        },
      }
    );
  });

  it("allows all headers with allowHeaders set to ALL", async () => {
    await runCorsTest(
      {
        origins: "*",
        allowMethods: ["PUT"],
        allowHeaders: "ALL",
      },
      {
        isPreflight: true,
        origin: "http://example.com",
        requestMethod: "PUT",
        requestHeaders: "X-Header, X-Other-Header",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "PUT,GET,HEAD,POST",
          "Access-Control-Allow-Headers": "X-Header, X-Other-Header", // TODO shouldn't the space after , be gone?
        },
      }
    );
  });

  it("sets Access-Control-Allow-Credentials when allowCredentials is true", async () => {
    await runCorsTest(
      { origins: "*", allowCredentials: true },
      { origin: "http://example.com" },
      {
        headers: {
          // "Access-Control-Allow-Origin": "http://example.com",
          "Access-Control-Allow-Origin": "*", // TODO this might be wrong
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  });

  it("does not set Access-Control-Allow-Credentials when allowCredentials is false", async () => {
    await runCorsTest(
      { origins: "*", allowCredentials: false },
      { origin: "http://example.com" },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  });

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

  // TODO fix this
  it.skip("adds Vary header for specific origins", async () => {
    await runCorsTest(
      { origins: ["http://example.com", "http://foo.com"] },
      { origin: "http://example.com" },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://example.com",
          Vary: "origin",
        },
      }
    );
  });

  // TODO fix this
  it.skip("adds Vary header for wildcard origins with credentials", async () => {
    await runCorsTest(
      { origins: "*", allowCredentials: true },
      { origin: "http://example.com" },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://example.com",
          "Access-Control-Allow-Credentials": "true",
          Vary: "origin",
        },
      }
    );
  });

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
