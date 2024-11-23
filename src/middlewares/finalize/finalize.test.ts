import { describe, expect, it } from "vitest";
import {
  CreateTestContextParams,
  createTestContext,
} from "../../helpers/testHelpers/createTestContext";
import { SerializeContext, SerializedBody } from "../serialize/helpers/types";
import { finalize } from "./finalize";
import { FinalizedResponse } from "./helpers/types";

const mw = finalize();

function createCustomTestContext(
  params?: CreateTestContextParams & { serializedBody?: SerializedBody }
): SerializeContext {
  const base = createTestContext(params);

  return {
    ...base,
    response: {
      ...base.response,
      serializedBody: params?.serializedBody ?? { type: "unset" },
    },
  };
}

async function expectFinalizedResponse(
  testContext: SerializeContext,
  expected: FinalizedResponse
) {
  const finalizedResponse = (await mw(testContext)).finalizedResponse;
  expect(finalizedResponse).toEqual(expected);
}

describe("finalize ", () => {
  it("handles errors", async () => {
    await expectFinalizedResponse(
      createCustomTestContext({
        error: { type: "error", error: "some error" },
      }),
      {
        type: "error-occured",
        body: "Error occured.",
        statusCode: 500,
        headers: {},
      }
    );
  });

  it("handles unset response", async () => {
    await expectFinalizedResponse(createCustomTestContext(), {
      type: "no-response-set",
      body: "No response set.",
      statusCode: 500,
      headers: {},
    });
  });

  it("handles unset serialized body", async () => {
    await expectFinalizedResponse(
      createCustomTestContext({
        response: { type: "set", body: null, statusCode: 200, headers: {} },
      }),
      {
        type: "no-serialized-body-set",
        body: "No serialized body set.",
        statusCode: 500,
        headers: {},
      }
    );
  });

  it("sets a final response", async () => {
    await expectFinalizedResponse(
      createCustomTestContext({
        response: { type: "set", body: null, statusCode: 200, headers: {} },
        serializedBody: { type: "set", body: "some body" },
      }),
      {
        type: "ok",
        body: "some body",
        statusCode: 200,
        headers: {},
      }
    );
  });
});
