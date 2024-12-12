import { noopMw } from "./helpers/noopMiddleware";
import { process } from "./helpers/process";
import type {
  BasePipelineContext,
  Middleware,
  Pipeline,
  PipelineMetadata,
} from "./helpers/types";

type MiddlewareLike = {
  (context: BasePipelineContext): Promise<BasePipelineContext>;
  collectMetadata?: () => PipelineMetadata;
  flatten?: () => Array<MiddlewareLike>;
};

type PipelineInternal = Pipeline<BasePipelineContext, BasePipelineContext> & {
  flatten: () => Array<MiddlewareLike>;
};

export function createPipeline<
  T00 extends BasePipelineContext,
  T01 extends T00,
  T02 extends T01,
  T03 extends T02,
  T04 extends T03,
  T05 extends T04,
  T06 extends T05,
  T07 extends T06
>(
  mw1: Middleware<T00, T01>,
  mw2: Middleware<T01, T02>,
  mw3: Middleware<T02, T03>,
  mw4: Middleware<T03, T04>,
  mw5: Middleware<T04, T05>,
  mw6: Middleware<T05, T06>,
  mw7: Middleware<T06, T07>
): Pipeline<T00, T07>;

export function createPipeline<
  T00 extends BasePipelineContext,
  T01 extends T00,
  T02 extends T01,
  T03 extends T02,
  T04 extends T03,
  T05 extends T04,
  T06 extends T05
>(
  mw1: Middleware<T00, T01>,
  mw2: Middleware<T01, T02>,
  mw3: Middleware<T02, T03>,
  mw4: Middleware<T03, T04>,
  mw5: Middleware<T04, T05>,
  mw6: Middleware<T05, T06>
): Pipeline<T00, T06>;

export function createPipeline<
  T00 extends BasePipelineContext,
  T01 extends T00,
  T02 extends T01,
  T03 extends T02,
  T04 extends T03,
  T05 extends T04
>(
  mw1: Middleware<T00, T01>,
  mw2: Middleware<T01, T02>,
  mw3: Middleware<T02, T03>,
  mw4: Middleware<T03, T04>,
  mw5: Middleware<T04, T05>
): Pipeline<T00, T05>;

export function createPipeline<
  T00 extends BasePipelineContext,
  T01 extends T00,
  T02 extends T01,
  T03 extends T02,
  T04 extends T03
>(
  mw1: Middleware<T00, T01>,
  mw2: Middleware<T01, T02>,
  mw3: Middleware<T02, T03>,
  mw4: Middleware<T03, T04>
): Pipeline<T00, T04>;

export function createPipeline<
  T00 extends BasePipelineContext,
  T01 extends T00,
  T02 extends T01,
  T03 extends T02
>(
  mw1: Middleware<T00, T01>,
  mw2: Middleware<T01, T02>,
  mw3: Middleware<T02, T03>
): Pipeline<T00, T03>;

export function createPipeline<
  T00 extends BasePipelineContext,
  T01 extends T00,
  T02 extends T01
>(mw1: Middleware<T00, T01>, mw2: Middleware<T01, T02>): Pipeline<T00, T02>;

export function createPipeline<
  T00 extends BasePipelineContext,
  T01 extends T00
>(mw1: Middleware<T00, T01>): Pipeline<T00, T01>;

export function createPipeline(...fns: Array<MiddlewareLike>) {
  const flattenedFns = fns
    .reduce(
      (acc, fn) => [...acc, ...(fn.flatten ? fn.flatten() : [fn])],
      new Array<MiddlewareLike>()
    )
    // TODO is this effective?
    .filter((fn) => fn !== noopMw);

  const pipeline: PipelineInternal = (context) =>
    process(context, flattenedFns, 0);

  const collectedMetadata = flattenedFns
    .map((fn) => fn.collectMetadata?.() ?? [])
    .flat();

  pipeline.collectMetadata = () => collectedMetadata;

  pipeline.flatten = () => flattenedFns;

  pipeline.split = (...fns: Array<any>) => {
    const p2 = (createPipeline as any).apply(null, fns);
    return [pipeline, p2] as [Pipeline<any, any>, Pipeline<any, any>];
  };

  return pipeline;
}
