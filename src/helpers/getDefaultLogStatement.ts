import { FinalizeContext } from "../middlewares/finalize/helpers/types";

export const getDefaultLogStatement = async (context: FinalizeContext) => {
  const endTime = performance.now();
  // prettier-ignore
  const route = `${context.request.method} ${context.request.path}${context.request.query ? "?" : ""}${context.request.query}`;
  const statusCode = context.finalizedResponse.statusCode;
  const responseTime = endTime - context.startTime;
  return `${route} (${statusCode}) (${responseTime.toFixed(2)}ms)`;
};
