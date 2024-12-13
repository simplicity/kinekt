import { describe, expect, it } from "vitest";
import { html } from "../../helpers/html";
import { MimeType } from "../../helpers/MimeType";
import { createTestContext } from "../../helpers/testHelpers/createTestContext";
import { serialize } from "./serialize";

const mw = serialize();

async function expectSerialization(
  givenBody: unknown,
  expectedBody: unknown,
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
    await expectSerialization(
      html.reply("some value"),
      "some value",
      "text/html"
    );
  });

  it("serializes text/plain", async () => {
    await expectSerialization("some value", "some value", "text/plain");
  });

  it("merges response headers", async () => {
    await expectSerialization("some value", "some value", "text/plain", {
      "Some-Header": "some value",
    });
  });

  it("always runs", async () => {
    expect(mw.alwaysRun).toEqual(true);
  });
});
