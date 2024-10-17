import type { Method } from "../types";
import { abort } from "./abort";
import { validMethods } from "./validMethods";

function isMethod(method: unknown): method is Method {
  return validMethods.includes(method as Method);
}

export function extractMethod(endpointDeclaration: string): Method {
  const method = endpointDeclaration.split(" ").at(0);

  if (isMethod(method)) {
    return method;
  }

  abort(
    `Invalid method '${method}' found in endpoint declaration '${endpointDeclaration}'`
  );
}
