import { afterEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { createFileData } from "../helpers/fileData";
import { mockEndpoint } from "../helpers/testHelpers/mockEndpoint";
import { createUser } from "./helpers/testHelpers/createUser";
import { getHtml } from "./helpers/testHelpers/getHtml";
import { multipartUpload } from "./helpers/testHelpers/multipartUpload";
import { urlEncodedUpload } from "./helpers/testHelpers/urlEncodedUpload";

describe("createValidatedEndpointFactory", () => {
  afterEach(() => vi.restoreAllMocks());

  it("allows to create a 'createComment' endpoint", async () => {
    expect(
      await mockEndpoint(createUser)({
        params: { organizationId: "some-organization-id" },
        query: { private: false },
        body: { email: "some@email.com" },
      })
    ).toEqual({
      type: "ok",
      value: {
        statusCode: 200,
        body: {
          id: "some-id",
          email: "some@email.com",
          organizationId: "some-organization-id",
          private: false,
        },
      },
    });

    expect(
      await mockEndpoint(createUser)({
        params: { organizationId: "some-organization-id" },
        query: { private: false },
        body: { email: "existing@email.com" },
      })
    ).toEqual({
      type: "ok",
      value: {
        statusCode: 409,
        body: { message: "User with this email already exists" },
      },
    });
  });

  it("allows to create a 'getHtml' endpoint", async () => {
    expect(await mockEndpoint(getHtml)({})).toEqual({
      type: "ok",
      value: { statusCode: 200, body: "<h1>hello world</h1>" },
    });
  });

  it("allows to create a 'multipartUpload' endpoint", async () => {
    expect(
      await mockEndpoint(multipartUpload)({
        body: {
          file: createFileData(
            await new Blob(["Hello, world!"], {
              type: "text/plain",
            }).arrayBuffer(),
            "file.txt",
            "text/plain"
          ),
        },
      })
    ).toEqual({
      type: "ok",
      value: { statusCode: 200, body: { text: "Hello, world!" } },
    });
  });

  // TODO this is probably not sending url encoded body
  it("allows to create a 'urlEncodedUpload' endpoint", async () => {
    expect(
      await mockEndpoint(urlEncodedUpload)({
        body: { someField: "some text" },
      })
    ).toEqual({
      type: "ok",
      value: { statusCode: 200, body: { someField: "some text" } },
    });
  });

  it("doesn't return an error when endpoint is not served but `notFound` middleware is present", async () => {
    expect(
      await mockEndpoint(getHtml, { dontServe: true, serveNotFound: true })({})
    ).toEqual({
      type: "ok",
      value: { statusCode: 404, body: "" },
    });
  });

  it("returns an error when endpoint is not served", async () => {
    expect(await mockEndpoint(getHtml, { dontServe: true })({})).toEqual({
      type: "error",
      code: "internal-server-error",
      description: "Internal Server Error",
      metadata: { cause: "No route found to serve request." },
    });
  });
});
