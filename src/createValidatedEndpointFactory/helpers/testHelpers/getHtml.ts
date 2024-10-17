import { html } from "../../../helpers/html";
import { testPipeline } from "./testPipeline";

export const getHtml = testPipeline.createEndpoint(
  "GET /html",

  { response: { 200: html() } },

  async () => {
    return {
      statusCode: 200,
      body: "<h1>hello world</h1>",
    };
  }
);
