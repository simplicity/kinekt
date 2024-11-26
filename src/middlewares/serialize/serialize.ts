import type { Middleware } from "../../createPipeline/helpers/types";
import { abort } from "../../helpers/abort";
import { CheckAcceptHeaderContext } from "../checkAcceptHeader/helpers/types";
import { reply } from "./helpers/reply";
import { serializeJson } from "./helpers/serializeJson";
import type {
  SerializeContext,
  SerializeContextExtension,
} from "./helpers/types";
import { serializeUnknown } from "./serializeUnknown";

function handle(context: CheckAcceptHeaderContext): SerializeContext {
  if (context.response.type !== "set") {
    return reply(context, {}, { type: "unset" });
  }

  switch (context.supportedMimeType) {
    case "*/*":
    case "application/json": {
      return reply(
        context,
        { "content-type": "application/json" },
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
        { "content-type": "text/html" },
        { type: "set", body: context.response.body }
      );
    }
    case "text/plain": {
      return reply(
        context,
        { "content-type": "text/plain" },
        { type: "set", body: context.response.body }
      );
    }
    case null: {
      return reply(
        context,
        { "content-type": "text/plain" },
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
