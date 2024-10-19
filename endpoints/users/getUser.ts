import type { Command } from "npm:@commander-js/extra-typings";
import z from "npm:zod";
import { printResult } from "../../printResult.ts";
import { createEndpoint } from "../../src/createEndpoint/createEndpoint.ts";

type User = {
  id: string;
  bla: string;
  name: string;
  email: string;
};

export const getUsers = createEndpoint(
  "GET /users",

  {
    response: z.custom<User>(),
  },

  () => {
    return Promise.resolve({ id: "", bla: "", name: "", email: "" });
  }
);

export const getUser = createEndpoint(
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

export const createUser = createEndpoint(
  "POST /users/:id/abc?bla",

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
    .action(async ({ name, email }) =>
      printResult(
        await createUser({
          path: { id: "someid" }, // TODO how does 'some-id' arrive in the controller?
          query: { bla: "test" },
          body: { name, email },
        })
      )
    );
}
