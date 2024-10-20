import type { Command } from "npm:@commander-js/extra-typings";
import z from "npm:zod";
import { printResult } from "../../../printResult.ts";
import { app } from "../../app.ts";
import type { User } from "./types.ts";

export const getUser = app.createEndpoint(
  // TODO when removing "more" here, the compiler doesn't complain
  "GET /users/:id?includePosts&more",

  // TODO how to disallow this?
  // "GET ",

  {
    params: z.object({ id: z.string() }),
    query: z.object({ includePosts: z.boolean(), more: z.string() }),
    response: z.custom<User>(),
  },

  ({ params, query }) => {
    console.log(params.id, query.includePosts, query.more);

    return Promise.resolve({ id: "", bla: "", name: "", email: "" });
  }
);
