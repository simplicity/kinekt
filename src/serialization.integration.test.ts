import { afterEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { getMixed } from "./createSchematizedEndpointFactory/helpers/testHelpers/getMixed";
import { MimeType } from "./helpers/MimeType";
import { mockEndpoint } from "./helpers/testHelpers/mockEndpoint";
import { StatusCode } from "./helpers/types";

function expectResult(
  result: unknown,
  expectedBody: unknown,
  expectedStatusCode: StatusCode,
  expectedContentType: MimeType
) {
  expect(result).toEqual({
    type: "ok",
    value: {
      body: expectedBody,
      statusCode: expectedStatusCode,
      headers: { "content-type": expectedContentType },
    },
  });
}

describe("serialization", () => {
  afterEach(() => vi.restoreAllMocks());

  it("serializes to application/json", async () => {
    expectResult(
      await mockEndpoint(getMixed)({ query: { type: "object" } }).all(),
      { n: 1 },
      200,
      "application/json"
    );
  });

  it("serializes to text/plain", async () => {
    expectResult(
      await mockEndpoint(getMixed)({ query: { type: "text" } }).all(),
      "some text",
      201,
      "text/plain"
    );
  });

  it("serializes to text/html", async () => {
    expectResult(
      await mockEndpoint(getMixed)({ query: { type: "html" } }).all(),
      "<h1>hello world</h1>",
      202,
      "text/html"
    );
  });
});
