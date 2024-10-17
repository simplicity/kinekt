import type { Command } from "npm:@commander-js/extra-typings";
import { z } from "npm:zod";
import { printResult } from "./printResult.ts";
import { createClient } from "./src/createClient/createClient.ts";
import { createRouteHandler } from "./src/createRouteHandler/createRouteHandler.ts";
import { post } from "./src/routeDefinition/post.ts";

type ResponseBody = { result: number };

const otherRoute = post(
  "/cool/:bla",
  z.object({ bla: z.string() }),
  z.void(),
  z.object({ data: z.string() }),
  z.custom<ResponseBody>()
);

export const otherRouteRegistration = createRouteHandler(
  otherRoute,
  (params, query, body) => {
    console.log("other route!");

    return Promise.resolve({ result: 1234 });
  }
);

const otherRouteClient = createClient(otherRoute);

export function registerOtherRouteCommand(program: Command) {
  program
    .command("other-route")
    .description("Other route")
    .requiredOption("--bla <string>", "Bla")
    .action(({ bla }) =>
      otherRouteClient({ bla }, undefined, { data: "sdf" }).then(printResult)
    );
}
