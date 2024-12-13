import { z } from "zod";
import { testSetup } from "./testSetup";

type User = {
  id: string;
  email: string;
  organizationId: string;
  private: boolean;
};

function zodBooleanFromString() {
  return z.enum(["true", "false"]).transform((value) => value === "true");
}

export const createUser = testSetup.createEndpoint(
  "POST /organization/:organizationId/users",

  {
    params: z.object({ organizationId: z.string() }),
    query: z.object({ private: zodBooleanFromString() }),
    body: z.object({ email: z.string() }),

    response: {
      200: z.custom<User>(),
      409: z.custom<{ message: string }>(),
    },
  },

  async ({ params, query, body }) => {
    if (body.email === "existing@email.com") {
      return {
        statusCode: 409,
        body: { message: "User with this email already exists" },
      };
    }

    return {
      statusCode: 200,
      body: {
        id: "some-id",
        email: body.email,
        organizationId: params.organizationId,
        private: query.private,
      },
    };
  }
);
