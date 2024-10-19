interface UnaryFunction<T, R> {
  (source: T): R;
}

export function isDefined<T>(item: T | null | undefined): item is T {
  return item !== null && item !== undefined;
}

function process<T>(
  check: (v: T) => boolean,
  input: any,
  fns: Array<UnaryFunction<any, any>>
) {
  const [fn, ...rest] = fns;

  if (check(input) === false || fn === undefined) {
    return input;
  }

  return process(check, fn(input), rest);
}

//prettier-ignore
export function pipe<T, A>(input: T, check: (v: T) => boolean, fn1: UnaryFunction<T, A>): A;
//prettier-ignore
export function pipe<T, A, B>(input: T, check: (v: T) => boolean, fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>): B;
//prettier-ignore
export function pipe<T, A, B, C>(input: T, check: (v: T) => boolean, fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>): C;
//prettier-ignore
export function pipe<T, A, B, C, D>(input: T, check: (v: T) => boolean, fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>): D;
//prettier-ignore
export function pipe<T, A, B, C, D, E>(input: T, check: (v: T) => boolean, fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>): E;
//prettier-ignore
export function pipe<T, A, B, C, D, E, F>(input: T, check: (v: T) => boolean, fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>): F;
//prettier-ignore
export function pipe<T, A, B, C, D, E, F, G>(input: T, check: (v: T) => boolean, fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>): G;
//prettier-ignore
export function pipe<T, A, B, C, D, E, F, G, H>(input: T, check: (v: T) => boolean, fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>, fn8: UnaryFunction<G, H>): H;

export function pipe<T, A, B, C, D, E, F, G, H, I>(
  input: T,
  check: (v: T) => boolean,
  fn1: UnaryFunction<T, A>,
  fn2?: UnaryFunction<A, B>,
  fn3?: UnaryFunction<B, C>,
  fn4?: UnaryFunction<C, D>,
  fn5?: UnaryFunction<D, E>,
  fn6?: UnaryFunction<E, F>,
  fn7?: UnaryFunction<F, G>,
  fn8?: UnaryFunction<G, H>,
  fn9?: UnaryFunction<H, I>
): I {
  return process(
    check,
    input,
    [fn1, fn2, fn3, fn4, fn5, fn6, fn7, fn8, fn9].filter(isDefined)
  );
}

type PipeParameters = Parameters<typeof pipe>;
