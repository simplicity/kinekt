import { isPrecheckResponseBody } from "../../helpers/precheckResponseBody";

export function serializeUnknown(body: unknown) {
  if (isPrecheckResponseBody(body)) {
    return body.message;
  }

  if (typeof body === "string") {
    return body;
  }

  return "";
}
