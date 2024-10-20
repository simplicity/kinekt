import { z } from "npm:zod";
import { app } from "../../app.ts";
import type { User } from "./types.ts";

export const getUsers = app.createEndpoint(
  "GET /users",

  {
    response: z.custom<User>(),
  },

  ({ context }) => {
    console.log(context.moar);
    // console.log(context.bla);

    return Promise.resolve({ id: "", bla: "", name: "", email: "" });
  }
);
