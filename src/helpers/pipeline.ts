export type BaseContext = {
  request: {
    url: string;
    method: "GET" | "OPTIONS";
  };
  halted: boolean;
  response: null | {
    code: number;
    body: any;
  };
};

export type Middleware<
  Context extends BaseContext,
  NewContext extends Context
> = (context: Context) => Promise<NewContext>;

type UnaryFunction<A, B> = (a: A) => Promise<B>;

async function process(
  input: BaseContext,
  fns: Array<UnaryFunction<any, any>>
) {
  if (input.halted === true) {
    console.log("pipeline halted");

    return input;
  }

  const [fn, ...rest] = fns;

  if (fn === undefined) {
    console.log("pipeline ended");

    return input;
  }

  return process(await fn(input), rest);
}

export function pipeline<R1 extends BaseContext, R2 extends R1, R3 extends R2>(
  f1: UnaryFunction<BaseContext, R1>,
  f2: UnaryFunction<R1, R2>,
  f3: UnaryFunction<R2, R3>
): (context: BaseContext) => Promise<R3>;

export function pipeline<R1 extends BaseContext, R2 extends R1>(
  f1: UnaryFunction<BaseContext, R1>,
  f2: UnaryFunction<R1, R2>
): (context: BaseContext) => Promise<R2>;

export function pipeline(...fns: Array<UnaryFunction<any, any>>) {
  return (context: BaseContext) => process(context, fns);
}
