import { z } from "zod";
import { html } from "../../../helpers/html";
import { testSetup } from "./testSetup";

export const getMixed = testSetup.createEndpoint(
  "GET /mixed",

  {
    query: z.object({ type: z.enum(["object", "text", "html"]) }),
    response: {
      200: z.object({ n: z.number() }),
      201: z.string(),
      202: html.schema(),
    },
  },

  async ({ query }) => {
    switch (query.type) {
      case "object": {
        return {
          statusCode: 200,
          body: { n: 1 },
        };
      }
      case "text": {
        return {
          statusCode: 201,
          body: "some text",
        };
      }
      case "html": {
        return {
          statusCode: 202,
          body: html.reply("<h1>hello world</h1>"),
        };
      }
    }
  }
);
