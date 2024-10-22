export type OkResult<Value> = { type: "ok"; value: Value };

type ErrorResultBase<Code extends string> = {
  type: "error";
  code: Code;
  description: string;
};

export type ErrorResult<
  Code extends string,
  Metadata extends
    | Record<string | number | symbol, unknown>
    | undefined = undefined
> = Metadata extends undefined
  ? ErrorResultBase<Code>
  : ErrorResultBase<Code> & { metadata: Metadata };

export type Result<
  Value,
  Code extends string,
  Metadata extends undefined | Record<string, any> = undefined
> = OkResult<Value> | ErrorResult<Code, Metadata>;

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

export function okResult<Value>(value: Value): OkResult<Value> {
  return {
    type: "ok",
    value,
  };
}

export function errorResult<
  Code extends string,
  Metadata extends
    | Record<string | number | symbol, unknown>
    | undefined = undefined
>(
  code: Code,
  description: string,
  metadata: Metadata
): ErrorResult<Code, Metadata> {
  return {
    type: "error",
    code,
    description,
    ...(metadata === undefined ? {} : { metadata }),
  } as ErrorResult<Code, Metadata>;
}

export function toResult<Value>(
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
