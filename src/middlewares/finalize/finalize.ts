import type { Middleware } from "../../createPipeline/helpers/types";
import type { SerializeContext } from "../serialize/helpers/types";
import { reply } from "./helpers/reply";
import { FinalizeContext, FinalizeContextExtension } from "./helpers/types";

function handle(context: SerializeContext): FinalizeContext {
  if (context.error.type === "error") {
    return reply(context, {
      type: "error-occured",
      body: "Error occured.",
      statusCode: 500,
      headers: {},
    });
  }

  if (context.response.type !== "set") {
    return reply(context, {
      type: "no-response-set",
      body: "No response set.",
      statusCode: 500,
      headers: {},
    });
  }

  if (context.response.serializedBody?.type === "unset") {
    return reply(context, {
      type: "no-serialized-body-set",
      body: "No serialized body set.",
      statusCode: 500,
      headers: {},
    });
  }

  return reply(context, {
    type: "ok",
    body: context.response.serializedBody.body,
    statusCode: context.response.statusCode,
    headers: context.response.headers,
  });
}

export const finalize = <
  In extends SerializeContext,
  Out extends In & FinalizeContextExtension
>(): Middleware<In, Out> => {
  const middleware: Middleware<In, Out> = async (context) =>
    handle(context) as Out;

  middleware.alwaysRun = true;

  return middleware;
};
