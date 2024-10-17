import type { Method, StatusCode } from "../types";

export type PipelineMetadata = Array<unknown>;

export type BasePipelineContextRequest = {
  fullUrl: string;
  path: string;
  params: unknown;
  query: string;
  method: Method;
  getHeader: (name: string) => string | null;
  readText: () => Promise<string>;
  readFormData: () => Promise<FormData>;
};

export type BasePipelineContextResponseUnset = {
  type: "unset";
};

export type BasePipelineContextResponseSet = {
  type: "set";
  statusCode: StatusCode;
  body: unknown;
  headers: Record<string, string>;
};

export type BasePipelineContextResponse =
  | BasePipelineContextResponseUnset
  | BasePipelineContextResponseSet;

export type BasePipelineContextError =
  | { type: "no-error" }
  | { type: "error"; error: unknown };

export type BasePipelineContext = {
  startTime: number;
  request: BasePipelineContextRequest;
  response: BasePipelineContextResponse;
  error: BasePipelineContextError;
  metadata: PipelineMetadata;
};

export type Middleware<In extends BasePipelineContext, Out extends In = In> = {
  (context: In): Promise<Out>;
  collectMetadata?: () => PipelineMetadata;
  alwaysRun?: true;
};

export type Pipeline<In extends BasePipelineContext, Out extends In> = {
  (context: In): Promise<Out>;

  collectMetadata: () => PipelineMetadata;

  split<
    T01 extends Out,
    T02 extends T01,
    T03 extends T02,
    T04 extends T03,
    T05 extends T04
  >(
    mw1: Middleware<Out, T01>,
    mw2: Middleware<T01, T02>,
    mw3: Middleware<T02, T03>,
    mw4: Middleware<T03, T04>,
    mw5: Middleware<T04, T05>
  ): [Pipeline<In, Out>, Pipeline<Out, T05>];

  split<T01 extends Out, T02 extends T01, T03 extends T02, T04 extends T03>(
    mw1: Middleware<Out, T01>,
    mw2: Middleware<T01, T02>,
    mw3: Middleware<T02, T03>,
    mw4: Middleware<T03, T04>
  ): [Pipeline<In, Out>, Pipeline<Out, T04>];

  split<T01 extends Out, T02 extends T01, T03 extends T02>(
    mw1: Middleware<Out, T01>,
    mw2: Middleware<T01, T02>,
    mw3: Middleware<T02, T03>
  ): [Pipeline<In, Out>, Pipeline<Out, T03>];

  split<T01 extends Out, T02 extends T01>(
    mw1: Middleware<Out, T01>,
    mw2: Middleware<T01, T02>
  ): [Pipeline<In, Out>, Pipeline<Out, T02>];

  split<T01 extends Out>(
    mw1: Middleware<Out, T01>
  ): [Pipeline<In, Out>, Pipeline<Out, T01>];
};
