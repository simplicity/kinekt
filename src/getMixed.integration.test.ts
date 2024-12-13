import { afterEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { getMixed } from "./createValidatedEndpointFactory/helpers/testHelpers/getMixed";
import { mockEndpoint } from "./helpers/testHelpers/mockEndpoint";

describe("getMixed", () => {
  afterEach(() => vi.restoreAllMocks());

  // TODO how can we test the content-type header?
  it("returns object", async () => {
    expect(
      await mockEndpoint(getMixed)({ query: { type: "object" } }).ok(200)
    ).toEqual({ n: 1 });
  });

  it("returns text", async () => {
    expect(
      await mockEndpoint(getMixed)({ query: { type: "text" } }).ok(201)
    ).toEqual("some text");
  });

  it("returns html", async () => {
    expect(
      await mockEndpoint(getMixed)({ query: { type: "html" } }).ok(202)
    ).toEqual("<h1>hello world</h1>");
  });
});
