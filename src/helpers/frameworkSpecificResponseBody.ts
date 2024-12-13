type FrameworkSpecificResponseBody = {
  type: "<framework-specific-response-body>";
  id: string;
  message: string;
};

export function isFrameworkSpecificResponseBody(
  body: unknown
): body is FrameworkSpecificResponseBody {
  return (
    (body as FrameworkSpecificResponseBody)?.type ===
    "<framework-specific-response-body>"
  );
}

export function frameworkSpecificResponseBody(
  id: string,
  message: string
): FrameworkSpecificResponseBody {
  return {
    type: "<framework-specific-response-body>",
    id,
    message,
  };
}
