import { z } from "zod";
import { testPipeline } from "./testPipeline";

export const urlEncodedUpload = testPipeline.createEndpoint(
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
