import { describe, expect, it } from "vitest";
import { BasePipelineContext } from "../../createPipeline/helpers/types";
import { createTestContext } from "../../helpers/testHelpers/createTestContext";
import { cors } from "./cors";
import { CorsParams } from "./helpers/types";

async function run(
  corsParams: CorsParams,
  params: {
    origin: string;
    isPreflight?: true;
    requestMethod?: string;
    requestHeaders?: string;
  }
) {
  const mw = cors(corsParams);

  const context = createTestContext({
    ...(params.isPreflight ? { method: "OPTIONS" as any } : {}), // TODO avoid any
    requestHeaders: {
      Origin: params.origin,
      ...(params.requestMethod
        ? { "Access-Control-Request-Method": params.requestMethod }
        : {}),
      ...(params.requestHeaders
        ? { "Access-Control-Request-Headers": params.requestHeaders }
        : {}),
    },
  });

  return mw(context);
}

function expectResponseSet(
  result: BasePipelineContext,
  params: { headers: Record<string, string> }
) {
  expect(result.response).toEqual({
    type: "set",
    statusCode: 200,
    body: null,
    headers: params.headers,
  });
}

function expectResponseUnset(result: BasePipelineContext) {
  expect(result.response).toEqual({ type: "unset" });
}

describe("cors", () => {
  it("allows matching origins", async () => {
    expectResponseSet(
      await run(
        { origins: ["http://example.com", "http://foo.com"] },
        { origin: "http://example.com" }
      ),
      {
        headers: { "Access-Control-Allow-Origin": "http://example.com" },
      }
    );
  });

  it("denies non-matching origins", async () => {
    expectResponseUnset(
      await run(
        { origins: ["http://foo.com"] },
        { origin: "http://example.com" }
      )
    );
  });

  it("allows wildcard origins", async () => {
    expectResponseSet(
      await run({ origins: "*" }, { origin: "http://example.com" }),
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  });

  it("handles regex origins", async () => {
    expectResponseSet(
      await run(
        { origins: [/example\.com$/, /foo\.com$/] },
        { origin: "http://sub.example.com" }
      ),
      {
        headers: { "Access-Control-Allow-Origin": "http://sub.example.com" },
      }
    );
  });

  it("allows preflight requests with valid methods", async () => {
    expectResponseSet(
      await run(
        { origins: "*", allowMethods: ["PUT", "PATCH"] },
        {
          isPreflight: true,
          origin: "http://example.com",
          requestMethod: "PUT",
        }
      ),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "PUT,PATCH,GET,HEAD,POST", // TODO is this correct?
        },
      }
    );
  });

  it("denies preflight requests with invalid methods", async () => {
    expectResponseSet(
      await run(
        { origins: "*", allowMethods: ["GET"] },
        {
          isPreflight: true,
          origin: "http://example.com",
          requestMethod: "PUT",
        }
      ),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,GET,HEAD,POST", // TODO fix this (and: is it correct?)
        },
      }
    );
  });

  it("allows preflight requests with valid headers", async () => {
    expectResponseSet(
      await run(
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
        }
      ),
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
    expectResponseSet(
      await run(
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
        }
      ),
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
    expectResponseSet(
      await run(
        { origins: "*", allowMethods: "ALL" },
        {
          isPreflight: true,
          origin: "http://example.com",
          requestMethod: "ANYMETHOD",
        }
      ),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "ANYMETHOD",
        },
      }
    );
  });

  it("allows all headers with allowHeaders set to ALL", async () => {
    expectResponseSet(
      await run(
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
        }
      ),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "PUT,GET,HEAD,POST",
          "Access-Control-Allow-Headers": "X-Header, X-Other-Header", // TODO shouldn't the space after , be gone?
        },
      }
    );
  });
});
