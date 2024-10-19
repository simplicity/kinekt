interface UnaryFunction<T, R> {
  (source: T): R;
}

// function isDefined<T>(item: T | null | undefined): item is T {
//   return item !== null && item !== undefined;
// }

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

// function pipe<InitialValue>(
//   initialValue: InitialValue,
//   // TODO naming
//   check: (currentValue: InitialValue) => boolean
// ): <A, B>(fn1: UnaryFunction<InitialValue, A>, fn2: UnaryFunction<A, B>) => B {
//   return (fn1, fn2) => fn2(fn1(initialValue));
// }

// TODO copy-pasted from rambda
// function pipe<TArgs extends any[], R1, R2, R3, R4, R5, R6>(
//   f1: (...args: TArgs) => R1,
//   f2: (a: R1) => R2,
//   f3: (a: R2) => R3,
//   f4: (a: R3) => R4,
//   f5: (a: R4) => R5,
//   f6: (a: R5) => R6
// ): (...args: TArgs) => R6;
// function pipe<TArgs extends any[], R1, R2, R3, R4, R5>(
//   f1: (...args: TArgs) => R1,
//   f2: (a: R1) => R2,
//   f3: (a: R2) => R3,
//   f4: (a: R3) => R4,
//   f5: (a: R4) => R5
// ): (...args: TArgs) => R5;
// function pipe<TArgs extends any[], R1, R2, R3, R4>(
//   f1: (...args: TArgs) => R1,
//   f2: (a: R1) => R2,
//   f3: (a: R2) => R3,
//   f4: (a: R3) => R4
// ): (...args: TArgs) => R4;
// function pipe<TArgs extends any[], R1, R2, R3>(
//   f1: (...args: TArgs) => R1,
//   f2: (a: R1) => R2,
//   f3: (a: R2) => R3,
//   proceed?: (currentValue: any) => boolean
// ): (...args: TArgs) => R3;

export function pipe<R1 extends BaseContext, R2 extends R1, R3 extends R2>(
  f1: (context: BaseContext) => R1,
  f2: (a: R1) => R2,
  f3: (a: R2) => R3
): (context: BaseContext) => R3;

export function pipe<R1 extends BaseContext, R2 extends R1>(
  f1: (context: BaseContext) => R1,
  f2: (a: R1) => R2
): (context: BaseContext) => R2;

// TODO we should probably allow promises

export function pipe(...fns: Array<UnaryFunction<any, any>>) {
  return (context: BaseContext) => process(context, fns);
}

function process(input: BaseContext, fns: Array<UnaryFunction<any, any>>) {
  if (input.halted === true) {
    console.log("pipeline halted");

    return input;
  }

  const [fn, ...rest] = fns;

  if (fn === undefined) {
    console.log("pipeline ended");

    return input;
  }

  return process(fn(input), rest);
}
