import type { EndpointDeclarationBase } from "../types";

export function removeMethod(
  endpointDeclaration: EndpointDeclarationBase
): string {
  return endpointDeclaration.split(" ").at(1) ?? "";
}
