import { Delimiters } from './parser/context/delimiter';
import { MarkdownParser } from '../../../markdown';

export type Parser<N, C extends CtxOptions = CtxOptions, D extends Parser<unknown, C>[] = any>
  = (input: Input<C & Ctx>) => Result<N, C, D>;
export interface Input<C extends CtxOptions = CtxOptions> {
  readonly source: string;
  readonly context: C & Ctx;
}
export type Result<N, C extends CtxOptions = CtxOptions, D extends Parser<unknown, C>[] = any>
  = readonly [N[], string, C, D]
  | readonly [N[], string]
  | undefined;
export interface Ctx extends CtxOptions {
  source: string;
  position: number;
}
export interface CtxOptions {
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
export type SubParsers<P extends Parser<unknown>> = P extends Parser<unknown, CtxOptions, infer D> ? D : never;
export type Context<P extends Parser<unknown>> = P extends Parser<unknown, infer C> ? C & Ctx : never;
export type SubNode<P extends Parser<unknown>> = ExtractSubNode<SubParsers<P>>;
export type IntermediateParser<P extends Parser<unknown>> = Parser<SubNode<P>, Context<P>, SubParsers<P>>;
type ExtractSubNode<D extends Parser<unknown>[]> = ExtractSubParser<D> extends infer N ? N extends Parser<infer U> ? U : never : never;
type ExtractSubParser<D extends Parser<unknown>[]> = D extends (infer P)[] ? P extends Parser<unknown> ? P : never : never;

export function input(source: string, context: CtxOptions): Input<Ctx>;
export function input(source: string, context: MarkdownParser.Options): Input<MarkdownParser.Context>;
export function input(source: string, context: CtxOptions): Input<Ctx> {
  // @ts-expect-error
  context.source = source;
  // @ts-expect-error
  context.position = 0;
  return {
    source,
    // @ts-expect-error
    context,
  };
}

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

export function failsafe<P extends Parser<unknown>>(parser: P, overwrite?: boolean): P;
export function failsafe<N>(parser: Parser<N>, overwrite = false): Parser<N> {
  assert(parser);
  return input => {
    const { context } = input;
    const { source, position } = context;
    const result = parser(input);
    if (result === undefined) {
      context.source = source;
      context.position = position;
    }
    else if (!overwrite) {
      context.source = source;
      //assert(context.position === source.length - exec(result).length);
      context.position = source.length - exec(result).length;
    }
    return result;
  };
}
