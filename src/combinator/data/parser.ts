import { Delimiters } from './parser/context/delimiter';

export type Parser<N, C extends Ctx = Ctx, D extends Parser<unknown, C>[] = any>
  = (input: Input<C>) => Result<N, C, D>;
export interface Input<C extends Ctx = Ctx> {
  readonly source: string;
  readonly context: C;
}
export type Result<N, C extends Ctx = Ctx, D extends Parser<unknown, C>[] = any>
  = readonly [N[], string, C, D]
  | readonly [N[], string]
  | undefined;
export interface Ctx {
  readonly resources?: {
    clock: number;
    recursions: number[];
  };
  offset?: number;
  precedence?: number;
  delimiters?: Delimiters;
  state?: number;
  // Objectの内部実装を利用する。
  // 探索木を直接使用する場合は探索速度が重要で挿入は相対的に少なく削除は不要かつ不確実であるため
  // AVL木が適当と思われる。
  backtracks?: Record<number, number>;
  linebreak?: number;
  recent?: string[];
}
export type Node<P extends Parser<unknown>> = P extends Parser<infer N> ? N : never;
export type SubParsers<P extends Parser<unknown>> = P extends Parser<unknown, Ctx, infer D> ? D : never;
export type Context<P extends Parser<unknown>> = P extends Parser<unknown, infer C> ? C : never;
export type SubNode<P extends Parser<unknown>> = ExtractSubNode<SubParsers<P>>;
export type IntermediateParser<P extends Parser<unknown>> = Parser<SubNode<P>, Context<P>, SubParsers<P>>;
type ExtractSubNode<D extends Parser<unknown>[]> = ExtractSubParser<D> extends infer N ? N extends Parser<infer U> ? U : never : never;
type ExtractSubParser<D extends Parser<unknown>[]> = D extends (infer P)[] ? P extends Parser<unknown> ? P : never : never;

export { eval_ as eval };
function eval_<N>(result: NonNullable<Result<N>>, default_?: N[]): N[];
function eval_<N>(result: Result<N>, default_: N[]): N[];
function eval_<N>(result: Result<N>, default_?: undefined): N[] | undefined;
function eval_<N>(result: Result<N>, default_?: N[]): N[] | undefined {
  return result
    ? result[0]
    : default_;
}

export function exec(result: NonNullable<Result<unknown>>, default_?: ''): string;
export function exec(result: Result<unknown>, default_: ''): string
export function exec(result: Result<unknown>, default_?: undefined): string | undefined;
export function exec(result: Result<unknown>, default_?: string): string | undefined {
  return result
    ? result[1]
    : default_;
}

export function check(source: string, result: Result<unknown>, mustConsume = true): true {
  assert.doesNotThrow(() => {
    if (source.length > 1000) return;
    if (source.slice(+mustConsume).slice(-exec(result, '').length || source.length) !== exec(result, '')) throw new Error();
  });
  return true;
}
