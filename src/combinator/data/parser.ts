export interface Ctx {
  readonly resources?: {
    budget: number;
  };
  delimiters?: ((source: string) => boolean)[];
}

export type Parser<T, C extends Ctx = Ctx, D extends Parser<unknown, C>[] = any>
  = (source: string, context: C) => Result<T, C, D>;
export type Result<T, C extends Ctx = Ctx, D extends Parser<unknown, C>[] = any>
  = readonly [T[], string, C, D]
  | readonly [T[], string]
  | undefined;
export type Tree<P extends Parser<unknown>> = P extends Parser<infer T> ? T : never;
export type SubParsers<P extends Parser<unknown>> = P extends Parser<unknown, any, infer D> ? D : never;
export type Context<P extends Parser<unknown>> = P extends Parser<unknown, infer C> ? C : never;
export type SubTree<P extends Parser<unknown>> = ExtractSubTree<SubParsers<P>>;
export type IntermediateParser<P extends Parser<unknown>> = Parser<SubTree<P>, Context<P>, SubParsers<P>>;
type ExtractSubTree<D extends Parser<unknown>[]> = ExtractSubParser<D> extends infer T ? T extends Parser<infer U> ? U : never : never;
type ExtractSubParser<D extends Parser<unknown>[]> = D extends (infer P)[] ? P extends Parser<unknown> ? P : never : never;

export { eval_ as eval };
function eval_<T>(result: NonNullable<Result<T>>, default_?: T[]): T[];
function eval_<T>(result: Result<T>, default_: T[]): T[];
function eval_<T>(result: Result<T>, default_?: undefined): T[] | undefined;
function eval_<T>(result: Result<T>, default_?: T[]): T[] | undefined {
  return result
    ? result[0]
    : default_;
}

export function exec(result: NonNullable<Result<unknown>>, default_?: string): string;
export function exec(result: Result<unknown>, default_: string): string
export function exec(result: Result<unknown>, default_?: undefined): string | undefined;
export function exec(result: Result<unknown>, default_?: string): string | undefined {
  return result
    ? result[1]
    : default_;
}

export function check(source: string, result: Result<unknown>, mustConsume = true): true {
  assert.doesNotThrow(() => {
    if (source.slice(+mustConsume).slice(-exec(result, '').length || source.length) !== exec(result, '')) throw new Error();
  });
  return true;
}
