import type { Command } from "npm:@commander-js/extra-typings";
import { z } from "npm:zod";
import { printResult } from "../../../printResult.ts";
import { app } from "../../app.ts";
import type { User } from "./types.ts";

export const createUser = app.createEndpoint(
  "POST /users/:id/abc?bla",

  {
    params: z.object({ id: z.string() }),
    query: z.object({ bla: z.string() }),
    request: z.object({ name: z.string(), email: z.string() }),
    response: z.custom<User>(),
  },

  ({ params, query, body, context }) => {
    console.log(`HERE`, context);

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
