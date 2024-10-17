import { test } from "vitest";
import { createTestContext } from "../../helpers/testHelpers/createTestContext";
import { deserialize } from "./deserialize";

const mw = deserialize();

test("benchmark", () => {
  const testContext = createTestContext({ method: "POST", text: "{}" });

  const start = performance.now();
  for (let index = 0; index < 100000; index++) {
    mw(testContext);
  }
  let end = performance.now();
  let duration = end - start;
  console.log(`Operation took ${duration.toFixed(2)} ms`);
});
