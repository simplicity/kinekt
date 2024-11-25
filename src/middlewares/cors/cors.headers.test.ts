import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

describe("cors headers", () => {
  it("allows preflight requests with valid headers", async () => {
    await runCorsTest(
      {
        origins: "*",
        allowMethods: ["PUT"],
        allowHeaders: ["X-One", "X-Two"],
      },
      {
        isPreflight: true,
        origin: "http://example.com",
        requestMethod: "PUT",
        requestHeaders: "X-One, X-Two",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "PUT,GET,HEAD,POST",
          "Access-Control-Allow-Headers": "X-One,X-Two",
        },
      }
    );
  });

  it("denies preflight requests with invalid headers", async () => {
    await runCorsTest(
      {
        origins: "*",
        allowMethods: ["PUT"],
        allowHeaders: ["X-One"],
      },
      {
        isPreflight: true,
        origin: "http://example.com",
        requestMethod: "PUT",
        requestHeaders: "X-One, X-Two",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "PUT,GET,HEAD,POST",
          "Access-Control-Allow-Headers": "X-One",
        },
      }
    );
  });

  it("allows all headers with allowHeaders set to ALL", async () => {
    await runCorsTest(
      {
        origins: "*",
        allowMethods: ["PUT"],
        allowHeaders: "ALL",
      },
      {
        isPreflight: true,
        origin: "http://example.com",
        requestMethod: "PUT",
        requestHeaders: "X-Header, X-Other-Header",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "PUT,GET,HEAD,POST",
          "Access-Control-Allow-Headers": "X-Header, X-Other-Header", // TODO shouldn't the space after , be gone?
        },
      }
    );
  });
});
