import { isPrecheckResponseBody } from "../../../helpers/precheckResponseBody";

export function serializeJson(body: unknown) {
  return JSON.stringify(
    isPrecheckResponseBody(body) ? { message: body.message } : body
  );
}
