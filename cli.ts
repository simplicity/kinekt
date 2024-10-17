import { Command } from "npm:@commander-js/extra-typings";
import { registerOtherRouteCommand } from "./otherRoute.ts";
import { registerSomeRouteCommand } from "./someRoute.ts";

export let verbose = false;

function increaseVerbosity() {
  verbose = true;
}

const program = new Command();

program
  .name("sco-migration")
  .version("0.0.0")
  .option(
    "-v, --verbose",
    "verbosity that can be increased",
    increaseVerbosity
  );

registerSomeRouteCommand(program);
registerOtherRouteCommand(program);

program.parse();
