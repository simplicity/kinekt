import { Origin } from "./types";

export function matchOrigin(
  requestOrigin: string | undefined,
  allowedOrigins: Origin[] | "*"
): boolean {
  if (allowedOrigins === "*") return true;
  if (!requestOrigin) return false;

  return allowedOrigins.some((origin) => {
    if (typeof origin === "string") return origin === requestOrigin;
    if (origin instanceof RegExp) return origin.test(requestOrigin);
    if (typeof origin === "function") return origin(requestOrigin);
    return false;
  });
}
