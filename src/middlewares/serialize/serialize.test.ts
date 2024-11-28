import { describe, expect, it } from "vitest";
import { MimeType } from "../../helpers/MimeType";
import { createTestContext } from "../../helpers/testHelpers/createTestContext";
import { serialize } from "./serialize";

const mw = serialize();

async function expectSerialization(
  givenBody: unknown,
  expectedBody: unknown,
  givenSupportedMimeType: MimeType | null,
  expectedSupportedMimeType: MimeType,
  additionalGivenHeaders: Record<string, string> = {}
) {
  const result = await mw({
    ...createTestContext({
      response: {
        type: "set",
        body: givenBody,
        headers: additionalGivenHeaders,
        statusCode: 200,
      },
    }),
    supportedMimeType: givenSupportedMimeType,
  });

  expect(result.response).toEqual({
    type: "set",
    body: givenBody,
    headers: {
      ...additionalGivenHeaders,
      "content-type": expectedSupportedMimeType,
    },
    statusCode: 200,
    serializedBody: {
      type: "set",
      body: expectedBody,
    },
  });
}

describe("serialize ", () => {
  it("sets serialized body to not ready if response is unset", async () => {
    const result = await mw({
      ...createTestContext(),
      supportedMimeType: "application/json",
    });

    expect(result.response).toEqual({
      type: "unset",
      serializedBody: { type: "unset" },
    });
  });

  it("serializes */*", async () => {
    await expectSerialization(
      { some: "property" },
      `{\"some\":\"property\"}`,
      "application/json",
      "application/json"
    );
  });

  it("serializes application/json", async () => {
    await expectSerialization(
      { some: "property" },
      `{\"some\":\"property\"}`,
      "application/json",
      "application/json"
    );
  });

  it("serializes text/html", async () => {
    await expectSerialization(
      "some value",
      "some value",
      "text/html",
      "text/html"
    );
  });

  it("serializes text/plain", async () => {
    await expectSerialization(
      "some value",
      "some value",
      "text/plain",
      "text/plain"
    );
  });

  it("defaults to text/plain when supportedMimeType is not set and body is a string", async () => {
    await expectSerialization("some value", "some value", null, "text/plain");
  });

  it("defaults to text/plain when supportedMimeType is not set and body is not a string", async () => {
    await expectSerialization({}, "", null, "text/plain");
  });

  it("merges response headers", async () => {
    await expectSerialization(
      "some value",
      "some value",
      "text/plain",
      "text/plain",
      { "Some-Header": "some value" }
    );
  });
});
