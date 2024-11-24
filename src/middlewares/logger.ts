import type { Middleware } from "../createPipeline/helpers/types";
import { consoleLogger } from "../helpers/consoleLogger";
import { getDefaultLogStatement } from "../helpers/getDefaultLogStatement";
import { Logger } from "../helpers/types";
import { FinalizeContext } from "./finalize/helpers/types";

export const logger = <PipelineContext extends FinalizeContext>(params?: {
  logger?: Logger;
  getLogStatement?: (context: FinalizeContext) => Promise<string>;
}): Middleware<PipelineContext, PipelineContext> => {
  const logger = params?.logger ?? consoleLogger;
  const getLogStatement = params?.getLogStatement ?? getDefaultLogStatement;

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
