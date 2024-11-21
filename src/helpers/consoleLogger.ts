import { Logger } from "./types";

export const consoleLogger: Logger = {
  debug: (...args) => console.debug(...args),
  info: (...args) => console.log(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
};
