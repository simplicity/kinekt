import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  BasePipelineContext,
  Middleware,
} from "../../createPipeline/helpers/types";
import {
  createTestContext,
  CreateTestContextParams,
} from "../../helpers/testHelpers/createTestContext";
import { expectResponse } from "../../helpers/testHelpers/expectResponse";
import {
  DeserializeContextExtension,
  DeserializedBody,
} from "../deserialize/helpers/types";
import {
  ValidatedEndpointContext,
  ValidatedEndpointContextExtension,
  ValidationErrors,
} from "./helpers/types";
import { validatedEndpoint } from "./schematizedEndpoint";

function createCustomTestContext(
  params?: CreateTestContextParams & { deserializedBody?: DeserializedBody }
): BasePipelineContext &
  DeserializeContextExtension &
  ValidatedEndpointContextExtension {
  const base = createTestContext(params);

  return {
    ...base,
    request: {
      ...base.request,
      deserializedBody: params?.deserializedBody ?? { type: "unset" },
    },
    validationErrors: [],
  };
}

async function expectValitationResults(
  mw: Middleware<
    BasePipelineContext &
      DeserializeContextExtension &
      ValidatedEndpointContextExtension,
    ValidatedEndpointContext
  >,
  expectedValidationErrors: ValidationErrors,
  body: unknown = null
) {
  const result = await mw(
    createCustomTestContext({
      method: "POST",
      deserializedBody: { type: "set", body },
    })
  );

  expectResponse("unset", result.response);
  expect(result.validationErrors).toEqual(expectedValidationErrors);
}

describe("schematizedEndpoint", () => {
  it("takes and returns data as described", async () => {
    const mw = validatedEndpoint(
      {
        endpointDeclaration: "POST /:id?async",
        params: z.object({ id: z.string() }),
        query: z.object({ async: z.coerce.boolean() }),
        body: z.string(),
        response: {
          200: z.object({
            id: z.string(),
            async: z.boolean(),
            body: z.string(),
          }),
        },
      },
      async ({ params, query, body }) => ({
        statusCode: 200,
        body: { id: params.id, async: query.async, body },
      })
    );

    const result = await mw(
      createCustomTestContext({
        method: "POST",
        params: { id: "some id" },
        query: "async=true",
        deserializedBody: { type: "set", body: "request body" },
      })
    );

    expectResponse("set", result.response, {
      body: {
        id: "some id",
        async: true,
        body: "request body",
      },
      statusCode: 200,
      headers: {},
    });
  });

  it("validates params", async () => {
    const mw = validatedEndpoint(
      {
        endpointDeclaration: "GET /:id",
        params: z.object({ id: z.string() }),
        response: {
          200: z.void(),
        },
      },
      async () => ({ statusCode: 200, body: undefined })
    );

    expectValitationResults(mw, [
      { message: "Problem with params.id: Required" },
    ]);
  });

  it("validates query", async () => {
    const mw = validatedEndpoint(
      {
        endpointDeclaration: "GET /path?name",
        query: z.object({ name: z.string() }),
        response: {
          200: z.void(),
        },
      },
      async () => ({ statusCode: 200, body: undefined })
    );

    expectValitationResults(mw, [
      { message: "Problem with query.name: Required" },
    ]);
  });

  it("validates body", async () => {
    const mw = validatedEndpoint(
      {
        endpointDeclaration: "POST /",
        body: z.object({ key: z.number() }),
        response: {
          200: z.void(),
        },
      },
      async () => ({ statusCode: 200, body: undefined })
    );

    expectValitationResults(mw, [
      { message: "Problem with body: Expected object, received null" },
    ]);

    expectValitationResults(
      mw,
      [{ message: "Problem with body.key: Required" }],
      {}
    );
  });

  it("merges response headers", async () => {
    const mw = validatedEndpoint(
      { endpointDeclaration: "GET /", response: { 200: z.void() } },
      async () => ({ statusCode: 200, body: undefined })
    );

    const result = await mw(
      createCustomTestContext({
        method: "POST",
        deserializedBody: { type: "set", body: undefined },
        response: {
          type: "partially-set",
          headers: { "Some-Header": "some value" },
        },
      })
    );

    expect(result.response).toEqual({
      type: "set",
      statusCode: 200,
      body: undefined,
      headers: { "Some-Header": "some value" },
    });
  });

  it("doesn't set a response if response is already set", async () => {
    const mw = validatedEndpoint(
      { endpointDeclaration: "GET /", response: { 200: z.void() } },
      async () => ({ statusCode: 200, body: undefined })
    );
    const context = createCustomTestContext({
      response: { type: "set", body: null, headers: {}, statusCode: 200 },
      deserializedBody: { type: "set", body: "some body" },
    });
    const result = await mw(context);
    expect(result.response).toBe(context.response);
  });
});
