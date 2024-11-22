import { describe, expect, it } from "vitest";
import { MimeType } from "../../helpers/MimeType";
import { createTestContext } from "../../helpers/testHelpers/createTestContext";
import { serialize } from "./serialize";

const mw = serialize();

async function expectSerialization(
  givenBody: unknown,
  expectedBody: unknown,
  supportedMimeType: MimeType | null,
  expectedSupportedMimeType = supportedMimeType
) {
  const result = await mw({
    ...createTestContext({
      response: {
        type: "set",
        body: givenBody,
        headers: {},
        statusCode: 200,
      },
    }),
    supportedMimeType,
  });

  expect(result.response).toEqual({
    type: "set",
    body: givenBody,
    headers: { "Content-Type": expectedSupportedMimeType },
    statusCode: 200,
    serializedBody: {
      type: "set",
      body: expectedBody,
    },
  });
}

describe("serialize ", () => {
  // TODO test that headers are merged

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
      "application/json"
    );
  });

  it("serializes application/json", async () => {
    await expectSerialization(
      { some: "property" },
      `{\"some\":\"property\"}`,
      "application/json"
    );
  });

  it("serializes text/html", async () => {
    await expectSerialization("some value", "some value", "text/html");
  });

  it("defaults to text/plain when supportedMimeType is not set and body is a string", async () => {
    await expectSerialization("some value", "some value", null, "text/plain");
  });

  it("defaults to text/plain when supportedMimeType is not set and body is not a string", async () => {
    await expectSerialization({}, "", null, "text/plain");
  });

  it("always runs", async () => {
    expect(mw.alwaysRun).toEqual(true);
  });
});
