import { afterEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { multipartUpload } from "./createSchematizedEndpointFactory/helpers/testHelpers/multipartUpload";
import { createFileData } from "./helpers/fileData";
import { mockEndpoint } from "./helpers/testHelpers/mockEndpoint";

describe("multipartUpload", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns 200", async () => {
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
      }).ok(200)
    ).toEqual({ text: "Hello, world!" });
  });
});
