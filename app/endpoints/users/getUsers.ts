import { z } from "npm:zod";
import { appPipeline } from "../../appPipeline.ts";
import type { User } from "./types.ts";

export const getUsers = appPipeline.createEndpoint(
  "GET /users",

  {
    response: { 200: z.custom<User>() },
  },

  ({ context }) => {
    console.log(context.moar);
    // console.log(context.bla);

    return Promise.resolve({
      code: 200,
      body: { id: "", bla: "", name: "", email: "" },
    });
  }
);
