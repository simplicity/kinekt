import { HasPipeline } from "../../helpers/types";

export type Server = (...endpoints: Array<HasPipeline>) => void;
