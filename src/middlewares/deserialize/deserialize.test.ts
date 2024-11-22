import { describe, expect, it } from "vitest";
import type { BasePipelineContext } from "../../createPipeline/helpers/types";
import { createTestContext } from "../../helpers/testHelpers/createTestContext";
import { deserialize } from "./deserialize";
import type { DeserializedBody } from "./helpers/types";

const mw = deserialize();

async function expectDeserializedBody(
  testContext: BasePipelineContext,
  expected: DeserializedBody
) {
  const deserializedBody = (await mw(testContext)).request.deserializedBody;
  expect(deserializedBody).toEqual(expected);
}

describe("deserialize ", () => {
  it("handles GET requests", async () => {
    await expectDeserializedBody(createTestContext(), {
      type: "set",
      body: null,
    });
  });

  it("handles application/json", async () => {
    await expectDeserializedBody(
      createTestContext({
        method: "POST",
        contentType: "application/json",
        text: '{ "some": "property" }',
      }),
      {
        type: "set",
        body: { some: "property" },
      }
    );
  });

  it("handles application/x-www-form-urlencoded", async () => {
    await expectDeserializedBody(
      createTestContext({
        method: "POST",
        contentType: "application/x-www-form-urlencoded",
        text: "some=property",
      }),
      {
        type: "set",
        body: { some: "property" },
      }
    );
  });

  it("handles multipart/form-data", async () => {
    const formData = new FormData();
    formData.append("some", "property");

    await expectDeserializedBody(
      createTestContext({
        method: "POST",
        contentType: "multipart/form-data",
        formData,
      }),
      {
        type: "set",
        body: { some: "property" },
      }
    );
  });

  it("handles text/html", async () => {
    await expectDeserializedBody(
      createTestContext({
        method: "POST",
        contentType: "text/html",
        text: "some text",
      }),
      {
        type: "set",
        body: "some text",
      }
    );
  });

  it("handles unsupported mime type", async () => {
    const result = await mw(
      createTestContext({ method: "POST", contentType: "unsupported" as any })
    );

    expect(result.request.deserializedBody).toEqual({ type: "unset" });
    expect(result.response).toEqual({
      type: "set",
      statusCode: 415,
      body: {
        type: "precheck-response-body",
        id: "unsupported-mime-type",
        message: "Unsupported MIME type 'unsupported'",
      },
      headers: {},
    });
  });

  it("handles unset mime type", async () => {
    await expectDeserializedBody(
      createTestContext({
        method: "POST",
        text: "some text",
      }),
      {
        type: "set",
        body: "some text",
      }
    );
  });

  it("handles malformed json", async () => {
    const result = await mw(
      createTestContext({
        method: "POST",
        contentType: "application/json",
        text: "{",
      })
    );

    expect(result.request.deserializedBody).toEqual({ type: "unset" });
    expect(result.response).toEqual({
      type: "set",
      statusCode: 415,
      body: {
        type: "precheck-response-body",
        id: "json-parse-error",
        message: "MIME type is valid, but received malformed content.",
      },
      headers: {},
    });
  });

  it("merges request headers", async () => {
    const result = await mw(
      createTestContext({
        method: "POST",
        contentType: "unsupported" as any,
        response: {
          type: "set",
          body: null,
          statusCode: 500,
          headers: { "Some-Header": "some value" },
        },
      })
    );

    expect(result.request.deserializedBody).toEqual({ type: "unset" });
    expect(result.response).toEqual({
      type: "set",
      statusCode: 415,
      body: {
        type: "precheck-response-body",
        id: "unsupported-mime-type",
        message: "Unsupported MIME type 'unsupported'",
      },
      headers: { "Some-Header": "some value" },
    });
  });
});
