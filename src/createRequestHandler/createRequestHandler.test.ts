import { describe, it } from "vitest";
import type { BasePipelineContext } from "../createPipeline/helpers/types";
import { createHandleRequestParams } from "../helpers/testHelpers/createHandleRequestParams";
import { expectStatusCode } from "../helpers/testHelpers/expectStatusCode";
import { handleRequestAndExpectOk } from "../helpers/testHelpers/handleRequestAndExpectOk";
import { FinalizeContextExtension } from "../middlewares/finalize/helpers/types";
import { createRequestHandler } from "./createRequestHandler";
import { createTestPipeline } from "./testHelpers/testPipeline";

const testEndpoint = createTestPipeline({
  path: "/",
  method: "GET",
  mimeType: "application/json",
  cb: async () => {
    return {
      type: "set",
      body: {},
      statusCode: 200,
      headers: {},
    };
  },
});

export const handleRequest = createRequestHandler([testEndpoint]);

// TODO add more tests

describe("createRequestHandler ", () => {
  it("handles GET requests", async () => {
    const testParams = createHandleRequestParams({
      contentType: "multipart/form-data",
    });
    const result = await handleRequestAndExpectOk<
      BasePipelineContext & FinalizeContextExtension
    >(testParams);

    expectStatusCode(result, 200);
  });
});
