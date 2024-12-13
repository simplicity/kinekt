import { z } from "zod";
import { testSetup } from "./testSetup";

export const urlEncodedUpload = testSetup.createEndpoint(
  "POST /urlEncodedUpload",

  {
    body: z.object({ someField: z.string() }),
    response: { 200: z.custom<{ someField: string }>() },
  },

  async ({ body }) => {
    return {
      statusCode: 200,
      body: { someField: body.someField },
    };
  }
);
