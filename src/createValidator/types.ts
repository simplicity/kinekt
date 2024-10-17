import type { ZodIssue } from "npm:zod";
import type { Result } from "./createValidator.ts";

export type Validator = (options: {
  params: any;
  query: any;
  body: any;
}) => Result<
  {
    parsedParams: any;
    parsedQuery: any;
    parsedBody: any;
  },
  Array<{ message: string; issue: ZodIssue }>
>;
