import type { Middleware } from "../../createPipeline/types";
import { abort } from "../../helpers/abort";
import { CheckAcceptHeaderContext } from "../checkAcceptHeader/types";
import { reply } from "./helpers/reply";
import { serializeJson } from "./helpers/serializeJson";
import { serializeUnknown } from "./serializeUnknown";
import type { SerializeContext, SerializeContextExtension } from "./types";

function handle(context: CheckAcceptHeaderContext): SerializeContext {
  if (context.response.type === "unset") {
    return reply(context, {}, { type: "unset" });
  }

  switch (context.supportedMimeType) {
    case "*/*":
    case "application/json": {
      return reply(
        context,
        { "Content-Type": "application/json" },
        { type: "set", body: serializeJson(context.response.body) }
      );
    }
    case "application/x-www-form-urlencoded": {
      return abort(
        "Serializing 'application/x-www-form-urlencoded' is not implemented yet"
      );
    }
    case "multipart/form-data": {
      return abort("Serializing 'multipart/form-data' is not implemented yet");
    }
    case "text/html": {
      return reply(
        context,
        { "Content-Type": "text/html" },
        { type: "set", body: context.response.body }
      );
    }
    case null: {
      return reply(
        context,
        { "Content-Type": "text/plain" },
        { type: "set", body: serializeUnknown(context.response.body) }
      );
    }
  }
}

export const serialize = <
  In extends CheckAcceptHeaderContext,
  Out extends In & SerializeContextExtension
>(): Middleware<In, Out> => {
  const middleware: Middleware<In, Out> = async (context) =>
    handle(context) as Out;

  middleware.alwaysRun = true;

  return middleware;
};
