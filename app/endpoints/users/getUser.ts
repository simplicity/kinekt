import z from "npm:zod";
import { appPipeline } from "../../appPipeline.ts";
import type { User } from "./types.ts";

export const getUser = appPipeline.createEndpoint(
  // TODO when removing "more" here, the compiler doesn't complain
  "GET /users/:id?includePosts&more",

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
