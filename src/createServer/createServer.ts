import { abort } from "../helpers/abort";
import { Logger } from "../helpers/types";
import { serveDeno } from "./helpers/serveDeno";
import { serveNode } from "./helpers/serveNode";
import { Server } from "./helpers/types";

declare const Deno: any;

export function createServer(params: { logger: Logger }): Server {
  return (...endpoints) => {
    if (typeof Deno !== "undefined" && Deno.version && Deno.version.deno) {
      serveDeno(endpoints, params.logger);
    } else if (
      typeof process !== "undefined" &&
      process.versions &&
      process.versions.node
    ) {
      serveNode(endpoints, params.logger);
    } else {
      abort("Unknown environment");
    }
  };
}
