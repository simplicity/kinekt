export type OkResult<Value> = { type: "ok"; value: Value };

export type ErrorResult<
  ErrorCode extends string,
  Metadata extends Record<string | number | symbol, unknown> | void = void
> = {
  type: "error";
  code: ErrorCode;
  description: string;
  metadata: Metadata;
};

export type Result<
  Value,
  ErrorCode extends string,
  Metadata extends Record<string | number | symbol, unknown> | void = void
> = OkResult<Value> | ErrorResult<ErrorCode, Metadata>;

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

export function okResult<Value>(value: Value): OkResult<Value> {
  return {
    type: "ok",
    value,
  };
}

export function errorResult<
  ErrorCode extends string,
  Metadata extends Record<string | number | symbol, unknown> | void = void
>(
  code: ErrorCode,
  description: string,
  metadata: Metadata
): ErrorResult<ErrorCode, Metadata> {
  return {
    type: "error",
    code,
    description,
    metadata,
  };
}

export async function toResult<Value>(
  promise: Promise<Value>
): Promise<Result<Value, "rejected-promise", { cause: string }>> {
  return promise
    .then((value) => okResult(value))
    .catch((error) =>
      errorResult("rejected-promise", "A promise was rejected with an error.", {
        cause: error?.toString?.() ?? "unknown error",
      })
    );
}
