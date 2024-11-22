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
  it("sets serialized body to not ready if response is unset", async () => {
    const result = await mw(
      createCustomTestContext({
        validationErrors: [{ message: "some message" }],
        response: {
          type: "set",
          body: null,
          statusCode: 500,
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

  // TODO probably remove this
  // it("aborts if response is already set", async () => {
  //   expect(() =>
  //     mw(
  //       createCustomTestContext({
  //         response: {
  //           type: "set",
  //           body: null,
  //           statusCode: 200,
  //           headers: { "Some-Header": "some value" },
  //         },
  //         validationErrors: [{ message: "some message" }],
  //       })
  //     )
  //   ).rejects.toThrowError("Response is already set.");
  // });
});
