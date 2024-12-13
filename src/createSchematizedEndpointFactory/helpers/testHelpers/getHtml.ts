import { html } from "../../../helpers/html";
import { testSetup } from "./testSetup";

export const getHtml = testSetup.createEndpoint(
  "GET /html",

  { response: { 200: html.schema() } },

  async () => {
    return {
      statusCode: 200,
      body: html.reply("<h1>hello world</h1>"),
    };
  }
);
