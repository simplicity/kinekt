import { HasPipeline, Logger } from "../../helpers/types";

export type Server = (...endpoints: Array<HasPipeline>) => void;

export type CreateServerParams = {
  port: number;
  hostname: string;
  logger: Logger;
};
