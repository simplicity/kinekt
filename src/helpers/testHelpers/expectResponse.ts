import { expect } from "vitest";
import {
  BasePipelineContextResponse,
  BasePipelineContextResponseSet,
} from "../../createPipeline/helpers/types";

export function expectResponse<
  Type extends BasePipelineContextResponse["type"]
>(
  type: Type,
  current: BasePipelineContextResponse,
  ...expected: Type extends "unset"
    ? []
    : [Omit<BasePipelineContextResponseSet, "type">]
) {
  switch (type) {
    case "set": {
      expect(current).toEqual({ ...expected.at(0), type: "set" });
      return;
    }
    case "unset": {
      expect(current).toEqual({ type: "unset" });
      return;
    }
  }
}
