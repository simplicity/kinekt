import { describe, expect, it } from "vitest";
import { createRequestHandler } from "../../createRequestHandler/createRequestHandler";
import { getHtml } from "../../createValidatedEndpointFactory/helpers/testHelpers/getHtml";
import { html } from "../../helpers/html";
import { createHandleRequestParams } from "../../helpers/testHelpers/createHandleRequestParams";
import { createTestContext } from "../../helpers/testHelpers/createTestContext";
import { Method } from "../../helpers/types";
import { BasePipelineContextResponseWithSerializedBody } from "../serialize/helpers/types";
import { cors } from "./cors";

async function expectRouted(
  path: string,
  method: Method,
  expectedResponse: BasePipelineContextResponseWithSerializedBody
) {
  const handleRequest = createRequestHandler([{ pipeline: getHtml.pipeline }]);
  const result = await handleRequest(
    createHandleRequestParams({
      path,
      method,
      headers: {
        origin: "http://example.com",
        "access-control-request-method": "GET",
        authorization: btoa("some@email.com"),
      },
    })
  );

  if (result.type === "error") {
    throw new Error('Unexpected: result.type === "error"');
  }

  expect(result.value.response).toEqual(expectedResponse);
}

describe("cors", () => {
  it("does nothing if origin header isn't set and it isn't a preflight request", async () => {
    const context = createTestContext();
    expect(await cors({ origins: "*" })(context)).toEqual(context);
  });

  it("sets a response if origin header isn't set and it is a preflight request", async () => {
    const context = createTestContext({ method: "OPTIONS" });
    const result = await cors({ origins: "*" })(context);

    expect(result.response).toEqual({
      type: "set",
      body: null,
      statusCode: 200,
      headers: {},
    });
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

    expect(result.response).toEqual({
      type: "set",
      body: null,
      statusCode: 200,
      headers: {},
    });
  });

  it("routes requests as expected and adds cors headers", async () => {
    await expectRouted("/html", "GET", {
      type: "set",
      body: html.reply("<h1>hello world</h1>"),
      statusCode: 200,
      headers: {
        "access-control-allow-origin": "http://example.com",
        "content-type": "text/html",
      },
      serializedBody: {
        type: "set",
        body: "<h1>hello world</h1>",
      },
    });
  });

  it("replies to preflight requests", async () => {
    await expectRouted("/html", "OPTIONS", {
      type: "set",
      body: null,
      statusCode: 200,
      headers: {
        "access-control-allow-origin": "http://example.com",
        "access-control-allow-methods": "GET,HEAD,POST,PUT,PATCH,DELETE",
        "content-type": "text/plain",
      },
      serializedBody: {
        type: "set",
        body: "",
      },
    });
  });
});
