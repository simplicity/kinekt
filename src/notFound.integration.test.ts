import { afterEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { getHtml } from "./createValidatedEndpointFactory/helpers/testHelpers/getHtml";
import { mockEndpoint } from "./helpers/testHelpers/mockEndpoint";

describe("notFound", () => {
  afterEach(() => vi.restoreAllMocks());

  it("doesn't return an error when endpoint is not served but `notFound` middleware is present", async () => {
    expect(
      await mockEndpoint(getHtml, { dontServe: true, serveNotFound: true })(
        {}
      ).ok(404)
    ).toEqual("");
  });

  it("returns an error when endpoint is not served", async () => {
    expect(await mockEndpoint(getHtml, { dontServe: true })({}).all()).toEqual({
      type: "error",
      code: "internal-server-error",
      description: "Internal Server Error",
      metadata: { cause: "No route found to serve request." },
    });
  });
});
