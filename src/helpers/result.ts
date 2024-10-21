export type Result<Value, Error> =
  | { type: "ok"; value: Value }
  | { type: "error"; error: Error };

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
