import { Command } from "@commander-js/extra-typings";
import { registerCreateUserCommand } from "./app/endpoints/users/createUser";
import { registerGetUserCommand } from "./app/endpoints/users/getUser";
import { registerMultipartUploadCommand } from "./app/endpoints/users/multipartUpload";

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

registerCreateUserCommand(program);
registerGetUserCommand(program);
registerMultipartUploadCommand(program);

program.parse();
