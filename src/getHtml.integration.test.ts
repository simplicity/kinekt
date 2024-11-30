import { afterEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { getHtml } from "./createValidatedEndpointFactory/helpers/testHelpers/getHtml";
import { mockEndpoint } from "./helpers/testHelpers/mockEndpoint";

describe("getHtml", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns 200", async () => {
    expect(await mockEndpoint(getHtml)({}).ok(200)).toEqual(
      "<h1>hello world</h1>"
    );
  });
});
