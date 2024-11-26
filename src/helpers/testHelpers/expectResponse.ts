import { expect } from "vitest";
import {
  BasePipelineContextResponse,
  BasePipelineContextResponsePartiallySet,
  BasePipelineContextResponseSet,
} from "../../createPipeline/helpers/types";

export function expectResponse<
  Type extends BasePipelineContextResponse["type"]
>(
  type: Type,
  current: BasePipelineContextResponse,
  ...expected: Type extends "unset"
    ? []
    : Type extends "partially-set"
    ? [Omit<BasePipelineContextResponsePartiallySet, "type">]
    : [Omit<BasePipelineContextResponseSet, "type">]
) {
  switch (type) {
    case "unset": {
      expect(current).toEqual({ type: "unset" });
      return;
    }
    case "partially-set": {
      expect(current).toEqual({ type: "unset" });
      return;
    }
    case "set": {
      expect(current).toEqual({ ...expected.at(0), type: "set" });
      return;
    }
  }
}
