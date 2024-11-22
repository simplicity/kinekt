import { afterEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { createFileData } from "../helpers/fileData";
import { mockEndpoint } from "../helpers/testHelpers/mockEndpoint";
import { createComment } from "./helpers/testHelpers/createComment";
import { getHtml } from "./helpers/testHelpers/getHtml";
import { multipartUpload } from "./helpers/testHelpers/multipartUpload";
import { urlEncodedUpload } from "./helpers/testHelpers/urlEncodedUpload";

describe("createValidatedEndpointFactory", () => {
  afterEach(() => vi.restoreAllMocks());

  it("allows to create a 'createComment' endpoint", async () => {
    expect(
      await mockEndpoint(createComment)({
        params: { postId: "some-post-id" },
        query: { anonymous: false },
        body: { text: "some text" },
      })
    ).toEqual({
      type: "ok",
      value: {
        statusCode: 200,
        body: {
          id: "some-id",
          text: "some text",
          postId: "some-post-id",
          createdBy: "stuffs",
        },
      },
    });

    expect(
      await mockEndpoint(createComment)({
        params: { postId: "some-post-id" },
        query: { anonymous: true },
        body: { text: "some text" },
      })
    ).toEqual({
      type: "ok",
      value: {
        statusCode: 422,
        body: { error: "Anonymous creation is not yet supported" },
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
});
