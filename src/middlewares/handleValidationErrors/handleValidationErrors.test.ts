import { describe, expect, it } from "vitest";
import { BasePipelineContext } from "../../createPipeline/helpers/types";
import {
  CreateTestContextParams,
  createTestContext,
} from "../../helpers/testHelpers/createTestContext";
import { ValidationErrors } from "../validatedEndpoint/helpers/types";
import { WithValidationContextExtension } from "../withValidation";
import { handleValidationErrors } from "./handleValidationErrors";

const mw = handleValidationErrors((validationErrors) => ({
  body: validationErrors,
  statusCode: 400,
}));

function createCustomTestContext(
  params?: CreateTestContextParams & {
    validationErrors?: ValidationErrors;
  }
): BasePipelineContext & WithValidationContextExtension {
  const base = createTestContext(params);

  return {
    ...base,
    response: {
      ...base.response,
    },
    validationErrors: params?.validationErrors ?? [],
  };
}

describe("handleValidationErrors ", () => {
  it("uses the provided callback to set a response", async () => {
    const result = await mw(
      createCustomTestContext({
        validationErrors: [{ message: "some message" }],
      })
    );

    expect(result.response).toEqual({
      type: "set",
      statusCode: 400,
      body: [{ message: "some message" }],
      headers: {},
    });
  });

  it("merges response headers", async () => {
    const result = await mw(
      createCustomTestContext({
        validationErrors: [{ message: "some message" }],
        response: {
          type: "partially-set",
          headers: { "Some-Header": "some value" },
        },
      })
    );

    expect(result.response).toEqual({
      type: "set",
      statusCode: 400,
      body: [{ message: "some message" }],
      headers: { "Some-Header": "some value" },
    });
  });

  it("doesn't set a response if response is already set", async () => {
    const context = createCustomTestContext({
      validationErrors: [],
      response: { type: "set", body: null, headers: {}, statusCode: 200 },
    });
    const result = await mw(context);
    expect(result.response).toBe(context.response);
  });
});
