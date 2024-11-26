import { describe, expect, it } from "vitest";
import { createPipeline } from "../../createPipeline/createPipeline";
import { BasePipelineContextResponseSet } from "../../createPipeline/helpers/types";
import { createRequestHandler } from "../../createRequestHandler/createRequestHandler";
import { basicEndpoint } from "../../helpers/testHelpers/basicEndpoint";
import { createHandleRequestParams } from "../../helpers/testHelpers/createHandleRequestParams";
import { createTestContext } from "../../helpers/testHelpers/createTestContext";
import { Method } from "../../helpers/types";
import { checkAcceptHeader } from "../checkAcceptHeader/checkAcceptHeader";
import { deserialize } from "../deserialize/deserialize";
import { cors } from "./cors";

// TODO test that headers are merged

async function expectRouted(
  path: string,
  method: Method,
  expectedResponse: BasePipelineContextResponseSet
) {
  const pipeline = createPipeline(
    cors({ origins: "*" }),
    deserialize(),
    checkAcceptHeader(),
    basicEndpoint({
      method: "GET",
      mimeType: "text/plain",
      path: "/a",
      cb: async () => ({
        type: "set",
        body: "some body",
        headers: { some: "header" },
        statusCode: 201,
      }),
    })
  );
  const handleRequest = createRequestHandler([{ pipeline }]);
  const result = await handleRequest(
    createHandleRequestParams({
      path,
      method,
      headers: { origin: "http://example.com" },
    })
  );

  if (result.type === "error") {
    console.log(result);
    throw new Error('Unexpected: result.type === "error"');
  }

  expect(result.value.response).toEqual(expectedResponse);
}

describe("cors", () => {
  it("does nothing if origin header isn't set", async () => {
    const context = createTestContext();
    expect(await cors({ origins: "*" })(context)).toEqual(context);
  });

  it("does nothing if origin doesn't match and request isn't a preflight", async () => {
    const context = createTestContext({
      requestHeaders: { origin: "http://beispiel.com" },
    });

    expect(await cors({ origins: ["http://example.com"] })(context)).toEqual(
      context
    );
  });

  it("sets a response if origin doesn't match and request is a preflight request", async () => {
    const context = createTestContext({
      method: "OPTIONS",
      requestHeaders: { origin: "http://beispiel.com" },
    });

    const result = await cors({ origins: ["http://example.com"] })(context);

    // TODO also test merging of response headers?

    expect(result.response).toEqual({
      type: "set",
      body: null,
      statusCode: 200,
      headers: {},
    });
  });

  it("routes requests as expected and adds cors headers", async () => {
    await expectRouted("/a", "GET", {
      type: "set",
      body: "some body",
      statusCode: 201,
      headers: {
        some: "header",
        "access-control-allow-origin": "*",
      },
    });
  });

  it("replies to preflight requests", async () => {
    await expectRouted("/a", "OPTIONS", {
      type: "set",
      body: null,
      statusCode: 200,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,HEAD,POST,PUT,PATCH,DELETE",
        "access-control-allow-headers": "", // TODO is this correct?
      },
    });
  });
});
