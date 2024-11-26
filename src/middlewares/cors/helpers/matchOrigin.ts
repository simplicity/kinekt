import { Origin } from "./types";

export function matchOrigin(
  requestOrigin: string,
  allowedOrigins: Origin[] | "*"
): boolean {
  if (allowedOrigins === "*") {
    return true;
  }

  return allowedOrigins.some(
    (origin) =>
      (typeof origin === "string" && origin === requestOrigin) ||
      (origin instanceof RegExp && origin.test(requestOrigin))
  );
}
