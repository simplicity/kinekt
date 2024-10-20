import { createEndpoint } from "../src/createEndpoint/createEndpoint.ts";
import type { BaseContext, Pipeline } from "./types.ts";

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

export function createPipeline<
  R1 extends BaseContext,
  R2 extends R1,
  R3 extends R2
>(
  f1: UnaryFunction<BaseContext, R1>,
  f2: UnaryFunction<R1, R2>,
  f3: UnaryFunction<R2, R3>
): Pipeline<R3>;

export function createPipeline<R1 extends BaseContext, R2 extends R1>(
  f1: UnaryFunction<BaseContext, R1>,
  f2: UnaryFunction<R1, R2>
): Pipeline<R2>;

export function createPipeline(...fns: Array<UnaryFunction<any, any>>) {
  const p = ((context: BaseContext) => process(context, fns)) as Pipeline<any>;
  p.createEndpoint = (...args) => createEndpoint(p, ...args);
  return p;
}
