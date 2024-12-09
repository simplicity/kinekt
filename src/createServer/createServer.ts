import { abort } from "../helpers/abort";
import { consoleLogger } from "../helpers/consoleLogger";
import { serveDeno } from "./helpers/serveDeno";
import { serveNode } from "./helpers/serveNode";
import { CreateServerParams, Server } from "./helpers/types";

declare const Deno: any;

export function createServer(params?: CreateServerParams): Server {
  const finalParams: Required<CreateServerParams> = {
    hostname: params?.hostname ?? "localhost",
    port: params?.port ?? 3000,
    logger: params?.logger ?? consoleLogger,
  };

  return (...endpoints) => {
    if (
      Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined ||
      (typeof Deno !== "undefined" && Deno.version && Deno.version.deno)
    ) {
      consoleLogger.info("Environment check: deno detected");
      serveDeno(endpoints, finalParams);
    } else if (
      typeof process !== "undefined" &&
      process.versions &&
      process.versions.node
    ) {
      consoleLogger.info("Environment check: node detected");
      serveNode(endpoints, finalParams);
    } else {
      abort("Unknown environment");
    }
  };
}
