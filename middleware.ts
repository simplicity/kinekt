import { pipe, type BaseContext } from "./src/helpers/pipe.ts";

type Middleware<Context extends BaseContext, NewContext extends Context> = (
  context: Context
) => Promise<NewContext>;

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

async function doStuff(context: BaseContext) {
  const pipeline = pipe(cors(), moar(), authenticate());

  const r = await pipeline(context);

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
