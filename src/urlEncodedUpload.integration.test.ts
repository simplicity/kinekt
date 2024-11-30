import { afterEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { urlEncodedUpload } from "./createValidatedEndpointFactory/helpers/testHelpers/urlEncodedUpload";
import { mockEndpoint } from "./helpers/testHelpers/mockEndpoint";

describe("urlEncodedUpload", () => {
  afterEach(() => vi.restoreAllMocks());

  // TODO this is probably not sending url encoded body
  it("returns 200", async () => {
    expect(
      await mockEndpoint(urlEncodedUpload)({
        body: { someField: "some text" },
      }).ok(200)
    ).toEqual({ someField: "some text" });
  });
});
