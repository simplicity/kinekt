import type { EndpointDeclarationBase } from "../createEndpoint/types.ts";

export function removeMethod(
  endpointDeclaration: EndpointDeclarationBase
): string {
  return endpointDeclaration.split(" ").at(1) ?? "";
}
