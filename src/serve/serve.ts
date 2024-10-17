import { abort } from "../helpers/abort";
import { HasPipeline, Logger } from "../types";
import { serveDeno } from "./helpers/serveDeno";
import { serveNode } from "./helpers/serveNode";

declare const Deno: any;

export async function serve(endpoints: Array<HasPipeline>, logger: Logger) {
  if (typeof Deno !== "undefined" && Deno.version && Deno.version.deno) {
    serveDeno(endpoints, logger);
  } else if (
    typeof process !== "undefined" &&
    process.versions &&
    process.versions.node
  ) {
    serveNode(endpoints, logger);
  } else {
    abort("Unknown environment");
  }
}
