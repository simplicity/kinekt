import type {
  BasePipelineContext,
  Middleware,
} from "../../createPipeline/helpers/types";
import { abort } from "../../helpers/abort";
import { frameworkSpecificResponseBody } from "../../helpers/frameworkSpecificResponseBody";
import { isDefined } from "../../helpers/isDefined";
import type { MimeType } from "../../helpers/MimeType";
import { isCheckAcceptHeaderMetadata } from "./helpers/metadata";
import { reply } from "./helpers/reply";

function handle(context: BasePipelineContext): BasePipelineContext {
  if (context.response.type === "set") {
    return reply(context, null);
  }

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

    return reply(context, {
      type: "set",
      statusCode: 406,
      body: frameworkSpecificResponseBody(
        "unsupported-mime-type",
        `Unable to satisfy requested MIME types [${requestedMimeTypesFormatted}]. Supported types: [${supportedMimeTypesFormatted}].`
      ),
      headers: {},
    });
  }

  return reply(context, null);
}

export const checkAcceptHeader = <
  In extends BasePipelineContext,
  Out extends In
>(): Middleware<In, Out> => {
  const middleware: Middleware<In, Out> = async (context) =>
    handle(context) as Out;

  return middleware;
};
