import { isFrameworkSpecificResponseBody } from "../../../helpers/frameworkSpecificResponseBody";

export function serializeJson(body: unknown) {
  return JSON.stringify(
    isFrameworkSpecificResponseBody(body) ? { message: body.message } : body
  );
}
