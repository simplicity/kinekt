import { afterEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { createUser } from "./createValidatedEndpointFactory/helpers/testHelpers/createUser";
import { mockEndpoint } from "./helpers/testHelpers/mockEndpoint";

describe("createUser", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns 200", async () => {
    expect(
      await mockEndpoint(createUser)({
        params: { organizationId: "some-organization-id" },
        query: { private: false },
        body: { email: "some@email.com" },
      }).ok(200)
    ).toEqual({
      id: "some-id",
      email: "some@email.com",
      organizationId: "some-organization-id",
      private: false,
    });
  });

  it("returns 409", async () => {
    expect(
      await mockEndpoint(createUser)({
        params: { organizationId: "some-organization-id" },
        query: { private: false },
        body: { email: "existing@email.com" },
      }).ok(409)
    ).toEqual({ message: "User with this email already exists" });
  });
});
