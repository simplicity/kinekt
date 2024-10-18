import type { Command } from "npm:@commander-js/extra-typings";
import z from "npm:zod";
import { get2 } from "../../src/routeDefinition/get.ts";
import { post2 } from "../../src/routeDefinition/post.ts";

type User = {
  name: string;
  email: string;
};

export const getUser = get2(
  "/users/:id?includePosts",
  z.object({ id: z.string() }),
  z.object({ includePosts: z.boolean() }),
  z.custom<User>(),
  ({ params, query }) => {
    console.log("other route!", params.id, query.includePosts);
    return Promise.resolve({ name: "", email: "" });
  }
);

export const createUser = post2(
  "/users",
  z.void(),
  z.void(),
  z.object({ name: z.string(), email: z.string() }),
  z.custom<User>(),
  ({ body }) => {
    console.log("other route!", body.name, body.email);
    return Promise.resolve({ name: "", email: "" });
  }
);

export function registerCreateUserCommand(program: Command) {
  program
    .command("create-user")
    .description("Create user")
    .requiredOption("--name <string>", "Name")
    .requiredOption("--email <string>", "Email")
    .action(({ name, email }) => {
      createUser(undefined, undefined, { name, email });
    });
}
