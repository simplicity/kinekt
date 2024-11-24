import { abort } from "../helpers/abort";
import { serveDeno } from "./helpers/serveDeno";
import { serveNode } from "./helpers/serveNode";
import { CreateServerParams, Server } from "./helpers/types";

declare const Deno: any;

export function createServer(params: CreateServerParams): Server {
  return (...endpoints) => {
    if (typeof Deno !== "undefined" && Deno.version && Deno.version.deno) {
      serveDeno(endpoints, params);
    } else if (
      typeof process !== "undefined" &&
      process.versions &&
      process.versions.node
    ) {
      serveNode(endpoints, params);
    } else {
      abort("Unknown environment");
    }
  };
}
