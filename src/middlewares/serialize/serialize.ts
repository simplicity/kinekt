import type {
  BasePipelineContext,
  Middleware,
} from "../../createPipeline/helpers/types";
import { isFrameworkSpecificResponseBody } from "../../helpers/frameworkSpecificResponseBody";
import { isHtml } from "../../helpers/html";
import { reply } from "./helpers/reply";
import { serializeJson } from "./helpers/serializeJson";
import type {
  SerializeContext,
  SerializeContextExtension,
} from "./helpers/types";

function handle(context: BasePipelineContext): SerializeContext {
  if (context.response.type !== "set") {
    return reply(context, {}, { type: "unset" });
  }

  if (context.response.body === null || context.response.body === undefined) {
    return reply(
      context,
      { "content-type": "text/plain" },
      { type: "set", body: "" }
    );
  }

  if (isHtml(context.response.body)) {
    return reply(
      context,
      { "content-type": "text/html" },
      { type: "set", body: context.response.body.html }
    );
  }

  const type = typeof context.response.body;

  if (type === "string") {
    return reply(
      context,
      { "content-type": "text/plain" },
      { type: "set", body: context.response.body }
    );
  }

  if (type === "object") {
    if (isFrameworkSpecificResponseBody(context.response.body)) {
      return reply(
        context,
        { "content-type": "text/plain" },
        { type: "set", body: context.response.body.message }
      );
    }

    return reply(
      context,
      { "content-type": "application/json" },
      { type: "set", body: serializeJson(context.response.body) }
    );
  }

  // TODO what to do here?
  return reply(
    context,
    { "content-type": "text/plain" },
    { type: "set", body: "" }
  );
}

export const serialize = <
  In extends BasePipelineContext,
  Out extends In & SerializeContextExtension
>(): Middleware<In, Out> => {
  const middleware: Middleware<In, Out> = async (context) =>
    handle(context) as Out;

  middleware.alwaysRun = true;

  return middleware;
};
