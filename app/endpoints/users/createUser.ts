import type { Command } from "npm:@commander-js/extra-typings";
import { z } from "npm:zod";
import { printResult } from "../../../printResult.ts";
import { appPipeline } from "../../appPipeline.ts";
import type { User } from "./types.ts";

export const createUser = appPipeline.createEndpoint(
  "POST /users/:id/abc?bla",

  {
    params: z.object({ id: z.string() }),
    query: z.object({ bla: z.string() }),
    request: z.object({ name: z.string(), email: z.string() }),
    response: {
      200: z.custom<User>(),
      400: z.object({ error: z.string() }),
    },
  },

  ({ params, query, body, context }) => {
    console.log(`User: ${context.user}`);

    if (Math.random() > 0.25) {
      return Promise.resolve({
        code: 200,
        body: {
          id: params.id,
          bla: query.bla,
          email: body.email,
          name: body.name,
        },
      });
    } else {
      return Promise.resolve({
        code: 400,
        body: {
          error: "A random error occured!",
        },
      });
    }
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
          params: { id: "some-id" },
          query: { bla: "test" },
          body: { name, email },
        })
      )
    );
}
