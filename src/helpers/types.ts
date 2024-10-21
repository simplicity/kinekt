export type Result<Value, Error> =
  | { type: "ok"; value: Value }
  | { type: "error"; error: Error };
