import type { Command } from "npm:@commander-js/extra-typings";
import { z } from "npm:zod";
import { createClient } from "./src/createClient/createClient.ts";
import { get } from "./src/get.ts";
import { printResult } from "./printResult.ts";
import { createRouteHandler } from "./src/createRouteHandler/createRouteHandler.ts";

type ResponseBody = { b: string };

const someRoute = get(
  "/some/:bla/path?abc",
  z.object({ bla: z.string() }),
  // TODO how to handle z.number()? the param will always come as a string, and zod will fail -> we have to auto-transform it
  z.object({ abc: z.string() }),
  z.custom<ResponseBody>()
);

export const someRouteRegistration = createRouteHandler(
  someRoute,
  (params, query, body) => {
    return Promise.resolve({ b: "slkdjf" });
  }
);

const someRouteClient = createClient(someRoute);

export function registerSomeRouteCommand(program: Command) {
  program
    .command("some-route")
    .description("Some route")
    .requiredOption("--bla <string>", "Bla")
    .requiredOption("--abc <string>", "Abc")
    .action(({ bla, abc }) =>
      someRouteClient({ bla }, { abc }).then(printResult)
    );
}
