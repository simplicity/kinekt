import { createPipeline } from "../createPipeline/createPipeline";
import { HasPipeline } from "../helpers/types";
import { LoggerParams } from "../middlewares/logger/helpers/types";
import { logger } from "../middlewares/logger/logger";
import { notFound } from "../middlewares/notFound/notFound";

export function createNotFoundEndpoint(
  params?: {
    paths?: Array<string>;
  } & LoggerParams
): HasPipeline {
  return {
    pipeline: createPipeline(
      notFound(...(params?.paths ?? [])),
      logger(params)
    ),
  };
}
