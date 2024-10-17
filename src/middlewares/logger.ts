import type { Middleware } from "../createPipeline/types";
import { consoleLogger } from "../helpers/consoleLogger";
import { getDefaultLogStatement } from "../helpers/getDefaultLogStatement";
import { Logger } from "../types";
import { FinalizeContext } from "./finalize/types";

export const logger = <PipelineContext extends FinalizeContext>(options?: {
  logger?: Logger;
  getLogStatement?: (context: FinalizeContext) => Promise<string>;
}): Middleware<PipelineContext, PipelineContext> => {
  const logger = options?.logger ?? consoleLogger;
  const getLogStatement = options?.getLogStatement ?? getDefaultLogStatement;

  const middleware: Middleware<PipelineContext, PipelineContext> = async (
    context
  ) => {
    await getLogStatement(context)
      .then((logStatement) => logger.info(logStatement))
      .catch((error) => {
        logger.error("Error in logger callback.", error);
        return null;
      });

    return context;
  };

  middleware.alwaysRun = true;

  return middleware;
};
