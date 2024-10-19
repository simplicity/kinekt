import { pipe, type BaseContext } from "./src/helpers/pipe.ts";

type Middleware<Context extends BaseContext, NewContext extends Context> = (
  context: Context
) => NewContext;

type Authenticated = { user: string };

const authenticate =
  <A extends BaseContext>(): Middleware<A, A & Authenticated> =>
  (context) => ({
    ...context,
    user: "stuffs",
  });

type Moar = { moar: boolean };

const moar =
  <A extends BaseContext>(): Middleware<A, A & Moar> =>
  (context) => ({
    ...context,
    moar: true,
  });

const cors =
  <A extends BaseContext>(): Middleware<A, A> =>
  (context) => {
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

export function doStuff(context: BaseContext) {
  const pipeline = pipe(cors(), moar(), authenticate());

  const r = pipeline(context);

  console.log(r.user);
  console.log(r.moar);
  console.log(r);
}

doStuff({
  request: {
    method: "GET",
    url: "https://example.com",
  },
  halted: false,
  response: null,
});
