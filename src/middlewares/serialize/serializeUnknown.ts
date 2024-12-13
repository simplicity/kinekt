import { isFrameworkSpecificResponseBody } from "../../helpers/frameworkSpecificResponseBody";

export function serializeUnknown(body: unknown) {
  if (isFrameworkSpecificResponseBody(body)) {
    return body.message;
  }

  if (typeof body === "string") {
    return body;
  }

  return "";
}
