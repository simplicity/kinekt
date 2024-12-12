import { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { AuthenticateCallbackResult } from "../../../middlewares/authenticate/helpers/types";
import { simpleSetup } from "../../../simpleSetup/simpleSetup";

export type TestSession = { user: { email: string } };

async function getSession<In extends BasePipelineContext>(
  context: In
): Promise<AuthenticateCallbackResult<TestSession>> {
  const authorization = context.request.getHeader("authorization");

  return authorization === null
    ? { type: "unset" }
    : { type: "set", session: { user: { email: atob(authorization) } } };
}

export const testPipeline = simpleSetup({
  checkAcceptHeader: true,
  cors: { origins: ["http://example.com"] },
  getSession,
});

testPipeline.setGlobalClientParams({ baseUrl: "https://some-test-domain.ch" });
