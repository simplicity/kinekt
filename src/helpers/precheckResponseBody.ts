type PrecheckResponseBody = {
  type: "precheck-response-body";
  id: string;
  message: string;
};

export function isPrecheckResponseBody(
  body: unknown
): body is PrecheckResponseBody {
  return (body as PrecheckResponseBody)?.type === "precheck-response-body";
}

// TODO bad naming
export function precheckResponseBody(
  id: string,
  message: string
): PrecheckResponseBody {
  return {
    type: "precheck-response-body",
    id,
    message,
  };
}
