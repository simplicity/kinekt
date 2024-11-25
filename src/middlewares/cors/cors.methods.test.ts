import { describe, it } from "vitest";
import { runCorsTest } from "./helpers/testHelpers/runCorsTest";

describe("cors methods", () => {
  it("allows preflight requests with valid methods", async () => {
    await runCorsTest(
      { origins: "*", allowMethods: ["PUT", "PATCH"] },
      {
        isPreflight: true,
        origin: "http://example.com",
        requestMethod: "PUT",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "PUT,PATCH,GET,HEAD,POST", // TODO is this correct?
        },
      }
    );
  });

  it("denies preflight requests with invalid methods", async () => {
    await runCorsTest(
      { origins: "*", allowMethods: ["GET"] },
      {
        isPreflight: true,
        origin: "http://example.com",
        requestMethod: "PUT",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,GET,HEAD,POST", // TODO fix this (and: is it correct?)
        },
      }
    );
  });

  it("allows all methods with allowMethods set to ALL", async () => {
    await runCorsTest(
      { origins: "*", allowMethods: "ALL" },
      {
        isPreflight: true,
        origin: "http://example.com",
        requestMethod: "ANYMETHOD",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "ANYMETHOD",
        },
      }
    );
  });
});
