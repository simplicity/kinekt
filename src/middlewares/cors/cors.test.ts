import { describe, expect, it } from "vitest";
import { createTestContext } from "../../helpers/testHelpers/createTestContext";
import { cors } from "./cors";

// TODO test that headers are merged

describe("cors", () => {
  it("does nothing if origin header isn't set", async () => {
    const context = createTestContext();
    expect(await cors({ origins: "*" })(context)).toEqual(context);
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

    // TODO also test that it is halted?
    // TODO also test merging of response headers?

    expect(result.response).toEqual({
      type: "set",
      body: null,
      statusCode: 200,
      headers: {},
    });
  });
});
