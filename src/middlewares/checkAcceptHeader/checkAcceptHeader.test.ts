import { describe, expect, it } from "vitest";
import { BasePipelineContext } from "../../createPipeline/helpers/types";
import {
  createTestContext,
  CreateTestContextParams,
} from "../../helpers/testHelpers/createTestContext";
import { expectResponse } from "../../helpers/testHelpers/expectResponse";
import { checkAcceptHeader } from "./checkAcceptHeader";
import { checkAcceptHeaderMetadata } from "./helpers/metadata";

const metadata = [
  checkAcceptHeaderMetadata([
    "application/json",
    "application/x-www-form-urlencoded",
  ]),
];

const mw = checkAcceptHeader();

function createCustomTestContext(
  params?: CreateTestContextParams
): BasePipelineContext {
  const base = createTestContext(params);

  return {
    ...base,
    metadata,
  };
}

describe("checkAcceptHeader ", () => {
  it("sets null if no metadata is provided", async () => {
    await expect(() => mw(createTestContext())).rejects.toThrowError(
      "CheckAcceptHeader middleware did not receive metadata."
    );
  });

  it("sets a default if no accept header is provided", async () => {
    const result = await mw(createCustomTestContext());
    expect(result.supportedMimeType).toBe("application/json");
    expectResponse("unset", result.response);
  });

  it("sets a default when '*/*' is provided", async () => {
    const result = await mw(createCustomTestContext({ accept: "*/*" }));
    expect(result.supportedMimeType).toBe("application/json");
    expectResponse("unset", result.response);
  });

  it("sets the accept header if accepted", async () => {
    const result = await mw(
      createCustomTestContext({ accept: "application/json" })
    );
    expect(result.supportedMimeType).toBe("application/json");
    expectResponse("unset", result.response);
  });

  it("handles unsupported mime types", async () => {
    const result = await mw(createCustomTestContext({ accept: "text/html" }));

    expectResponse("set", result.response, {
      body: {
        id: "unsupported-mime-type",
        message:
          "Unable to satisfy requested MIME types [text/html]. Supported types: [application/json, application/x-www-form-urlencoded].",
        type: "precheck-response-body",
      },
      headers: {},
      statusCode: 406,
    });
  });

  it("merges request headers", async () => {
    const result = await mw(
      createCustomTestContext({
        accept: "text/html",
        response: {
          type: "partially-set",
          headers: { "Some-Header": "some value" },
        },
      })
    );

    expectResponse("set", result.response, {
      body: {
        id: "unsupported-mime-type",
        message:
          "Unable to satisfy requested MIME types [text/html]. Supported types: [application/json, application/x-www-form-urlencoded].",
        type: "precheck-response-body",
      },
      headers: { "Some-Header": "some value" },
      statusCode: 406,
    });
  });
});
