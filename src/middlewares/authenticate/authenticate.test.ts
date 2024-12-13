import { describe, expect, it } from "vitest";
import { createTestContext } from "../../helpers/testHelpers/createTestContext";
import { authenticate } from "./authenticate";

const mw = authenticate(async (context) => {
  const authorization = context.request.getHeader("authorization");

  return authorization === null
    ? { type: "unset" }
    : { type: "set", session: authorization };
});

describe("authenticate", () => {
  it("sets the session returned by handler", async () => {
    const result = await mw(
      createTestContext({
        requestHeaders: { authorization: "some authorization" },
      })
    );
    expect(result.response).toEqual({ type: "unset" });
    expect(result.session).toBe("some authorization");
  });

  it("returns 401 if handler doesn't set a session", async () => {
    const result = await mw(createTestContext());
    expect(result.response).toEqual({
      type: "set",
      body: {
        id: "authentication-failed",
        message: "Authentication failed",
        type: "<framework-specific-response-body>",
      },
      statusCode: 401,
      headers: {},
    });
  });

  it("merges request headers", async () => {
    const context = createTestContext({
      response: {
        type: "partially-set",
        headers: { "Some-Header": "some value" },
      },
    });

    const result = await mw(context);

    expect(result.response).toEqual({
      type: "set",
      body: {
        id: "authentication-failed",
        message: "Authentication failed",
        type: "<framework-specific-response-body>",
      },
      statusCode: 401,
      headers: { "Some-Header": "some value" },
    });
  });

  it("doesn't set a response if response is already set", async () => {
    const context = createTestContext({
      response: { type: "set", body: null, statusCode: 200, headers: {} },
    });
    const result = await mw(context);
    expect(result.response).toBe(context.response);
  });
});
