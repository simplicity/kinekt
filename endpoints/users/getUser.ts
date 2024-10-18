import type { Command } from "npm:@commander-js/extra-typings";
import z from "npm:zod";
import { get2 } from "../../src/routeDefinition/get.ts";
import { post2 } from "../../src/routeDefinition/post.ts";

type User = {
  id: string;
  bla: string;
  name: string;
  email: string;
};

export const getUser = get2(
  "/users/:id?includePosts",

  {
    params: z.object({ id: z.string() }),
    query: z.object({ includePosts: z.boolean() }),
    response: z.custom<User>(),
  },

  ({ params, query }) => {
    console.log(params.id, query.includePosts);

    return Promise.resolve({ id: "", bla: "", name: "", email: "" });
  }
);

export const createUser = post2(
  "/users/:id/abc?bla",

  {
    params: z.object({ id: z.string() }),
    query: z.object({ bla: z.string() }),
    request: z.object({ name: z.string(), email: z.string() }),
    response: z.custom<User>(),
  },

  ({ params, query, body }) => {
    return Promise.resolve({
      id: params.id,
      bla: query.bla,
      name: body.name,
      email: body.email,
    });
  }
);

export function registerCreateUserCommand(program: Command) {
  program
    .command("create-user")
    .description("Create user")
    .requiredOption("--name <string>", "Name")
    .requiredOption("--email <string>", "Email")
    .action(({ name, email }) => {
      createUser({ id: "" }, { bla: "" }, { name, email });
    });
}
