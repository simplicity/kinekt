import { createPipeline } from "../src/createPipeline/createPipeline.ts";
import type {
  BasePipelineContext,
  Middleware,
} from "../src/createPipeline/types.ts";

type Authenticated = { user: string };

const authenticate =
  <A extends BasePipelineContext>(): Middleware<A, A & Authenticated> =>
  async (context) => ({
    ...context,
    user: "stuffs",
  });

type Moar = { moar: boolean };

const moar =
  <A extends BasePipelineContext>(): Middleware<A, A & Moar> =>
  async (context) => ({
    ...context,
    moar: true,
  });

const cors =
  <A extends BasePipelineContext>(): Middleware<A, A> =>
  async (context) => {
    if (context.request.method !== "OPTIONS") {
      return context;
    }

    return {
      ...context,
      halted: true,
      response: {
        code: 200,
        body: {},
      },
    };
  };

export const appPipeline = createPipeline(cors(), moar(), authenticate());