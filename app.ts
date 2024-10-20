import {
  pipeline,
  type BaseContext,
  type Middleware,
} from "./src/helpers/pipeline.ts";

type Authenticated = { user: string };

const authenticate =
  <A extends BaseContext>(): Middleware<A, A & Authenticated> =>
  async (context) => ({
    ...context,
    user: "stuffs",
  });

type Moar = { moar: boolean };

const moar =
  <A extends BaseContext>(): Middleware<A, A & Moar> =>
  async (context) => ({
    ...context,
    moar: true,
  });

const cors =
  <A extends BaseContext>(): Middleware<A, A> =>
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

export const app = pipeline(cors(), moar(), authenticate());
