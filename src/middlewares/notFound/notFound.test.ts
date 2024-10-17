import { describe } from "node:test";
import { expect, it } from "vitest";
import { createPipeline } from "../../createPipeline/createPipeline";
import { createRequestHandler } from "../../createRequestHandler/createRequestHandler";
import { createHandleRequestParams } from "../../helpers/testHelpers/createHandleRequestParams";
import { createTestContext } from "../../helpers/testHelpers/createTestContext";
import { notFound } from "./notFound";

const mw = notFound();

async function expectRouted(
  configuredPaths: Array<string>,
  path: string,
  expectation: boolean
) {
  const pipeline = createPipeline(notFound(...configuredPaths));
  const handleRequest = createRequestHandler([{ pipeline }]);
  const result = await handleRequest(createHandleRequestParams({ path }));

  if (expectation === true) {
    expect(result.type).toEqual("ok");
  } else {
    expect(result.type).toEqual("error");
  }
}

describe("notFound", () => {
  it("finalizes the response", async () => {
    const result = await mw(createTestContext());

    expect(result.finalizedResponse).toEqual({
      type: "ok",
      statusCode: 404,
      body: null,
      headers: {},
    });
  });

  it("sets up matchers", async () => {
    await expectRouted(["/"], "/", true);
    await expectRouted(["/"], "/some-path", true);
    await expectRouted(["/"], "/some-path/some-path", true);
    await expectRouted(["/some-path"], "/", false);
    await expectRouted(["/some-path"], "/some-path", true);
    await expectRouted(["/some-path"], "/some-path/sub-path", true);
    await expectRouted(["/some-path"], "/some-path/sub-path/sub-path", true);
  });
});
