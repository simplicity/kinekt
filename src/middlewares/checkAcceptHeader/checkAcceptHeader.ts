import type {
  BasePipelineContext,
  Middleware,
} from "../../createPipeline/helpers/types";
import { abort } from "../../helpers/abort";
import { isDefined } from "../../helpers/isDefined";
import type { MimeType } from "../../helpers/MimeType";
import { precheckResponseBody } from "../../helpers/precheckResponseBody";
import { isCheckAcceptHeaderMetadata } from "./helpers/metadata";
import { reply } from "./helpers/reply";
import {
  CheckAcceptHeaderContext,
  CheckAcceptHeaderContextExtension,
} from "./helpers/types";

function handle(context: BasePipelineContext): CheckAcceptHeaderContext {
  const supportedMimeTypes =
    context.metadata.find(isCheckAcceptHeaderMetadata)?.mimeTypes ?? [];

  if (supportedMimeTypes.length === 0) {
    abort("CheckAcceptHeader middleware did not receive metadata.");
  }

  const requestedMimeTypes = context.request
    .getHeader("accept")
    ?.split(",")
    .map((item) => item.split(";").at(0))
    .filter(isDefined) ?? ["*/*" satisfies MimeType];

  const supportedMimeType = requestedMimeTypes.includes("*/*")
    ? supportedMimeTypes.at(0)
    : supportedMimeTypes.find((supportedMimeType) =>
        requestedMimeTypes.includes(supportedMimeType)
      );

  if (supportedMimeType === undefined) {
    const requestedMimeTypesFormatted = requestedMimeTypes.join(", ");
    const supportedMimeTypesFormatted = supportedMimeTypes.join(", ");

    return reply(
      context,
      {
        type: "set",
        statusCode: 406,
        body: precheckResponseBody(
          "unsupported-mime-type",
          `Unable to satisfy requested MIME types [${requestedMimeTypesFormatted}]. Supported types: [${supportedMimeTypesFormatted}].`
        ),
        headers: {},
      },
      null
    );
  }

  return reply(context, null, supportedMimeType);
}

export const checkAcceptHeader = <
  In extends BasePipelineContext,
  Out extends In & CheckAcceptHeaderContextExtension
>(): Middleware<In, Out> => {
  const middleware: Middleware<In, Out> = async (context) =>
    handle(context) as Out;

  return middleware;
};
