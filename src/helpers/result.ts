export type OkResult<Value> = { type: "ok"; value: Value };

export type ErrorResult<
  Error extends string = string,
  ErrorMetadata extends Record<string, unknown> | undefined = undefined
> = ErrorMetadata extends undefined
  ? { type: "error"; error: Error }
  : { type: "error"; error: Error } & Omit<ErrorMetadata, "error">;

export type Result<
  Value,
  Error extends string = string,
  ErrorMetadata extends undefined | Record<string, any> = undefined
> = OkResult<Value> | ErrorResult<Error, ErrorMetadata>;

// TODO naming - look at how this is done e.g. in https://gigobyte.github.io/purify/getting-started
export function fallback<Value, Fallback>(
  result: Result<Value, any>,
  fallback: Fallback
): Value | Fallback {
  switch (result.type) {
    case "ok": {
      return result.value;
    }
    case "error": {
      return fallback;
    }
  }
}

// TODO c for callback - improve
export function fallback_c<Value, Fallback>(fallbackV: Fallback) {
  return (result: Result<Value, any>) => fallback(result, fallbackV);
}

export function toResult<Value>(
  promise: Promise<Value>
): Promise<Result<Value>> {
  return promise
    .then((value) => ({ type: "ok" as const, value }))
    .catch((error) => ({
      type: "error",
      error: error?.toString?.() ?? "unknown error",
    }));
}
