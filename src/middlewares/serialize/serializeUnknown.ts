import { isPrecheckResponseBody } from "../../helpers/precheckResponseBody";

export function serializeUnknown(body: unknown) {
  return isPrecheckResponseBody(body) ? body.message : "";
}
