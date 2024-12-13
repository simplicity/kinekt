import { z } from "zod";
import { fileDataSchema } from "../../../helpers/fileData";
import { testSetup } from "./testSetup";

export const multipartUpload = testSetup.createEndpoint(
  "POST /multipartUpload",

  {
    body: z.object({ file: fileDataSchema() }),
    response: { 200: z.object({ text: z.string() }) },
  },

  async ({ body }) => {
    const arrayBuffer = await body.file.arrayBuffer();
    const text = new TextDecoder().decode(arrayBuffer);

    return {
      statusCode: 200,
      body: { text },
    };
  }
);
