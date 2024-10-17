import {
  Middleware,
  type BasePipelineContext,
} from "../../createPipeline/types";
import { getBodyForBodyParseResult } from "./helpers/getBodyForBodyParseResult";
import { parseBodyAccordingToMimeType } from "./helpers/parseBodyAccordingToMimeType/parseBodyAccordingToMimeType";
import { reply } from "./helpers/reply";
import { DeserializeContext, DeserializeContextExtension } from "./types";

async function handle(
  context: BasePipelineContext
): Promise<DeserializeContext> {
  if (context.request.method === "GET") {
    return reply(context, null, {
      type: "set",
      body: null,
    });
  }

  const bodyParseResult = await parseBodyAccordingToMimeType(context);

  switch (bodyParseResult.type) {
    case "ok": {
      return reply(context, null, {
        type: "set",
        body: bodyParseResult.value,
      });
    }
    case "error": {
      return reply(
        context,
        {
          type: "set",
          body: getBodyForBodyParseResult(bodyParseResult),
          statusCode: 415,
          headers: {},
        },
        {
          type: "unset",
        }
      );
    }
  }
}

export const deserialize = <
  In extends BasePipelineContext,
  Out extends In & DeserializeContextExtension
>(): Middleware<In, Out> => {
  const middleware: Middleware<In, Out> = async (context) =>
    handle(context) as Promise<Out>;

  return middleware;
};
