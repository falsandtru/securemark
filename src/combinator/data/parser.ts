export interface Ctx {
  readonly resources?: {
    budget: number;
  };
  delimiters?: ((source: string) => boolean)[];
}

export type Parser<T, D extends Parser<unknown, any, C>[] = any, C extends Ctx = Ctx>
  = (source: string, context: C) => Result<T, D, C>;
export type Result<T, D extends Parser<unknown, any, C>[] = any, C extends Ctx = Ctx>
  = readonly [T[], string]
  | readonly [T[], string, C, D]
  | undefined;
export type Data<P extends Parser<unknown>> = P extends Parser<infer T> ? T : never;
export type SubParsers<P extends Parser<unknown>> = P extends Parser<unknown, infer D> ? D : never;
export type Context<P extends Parser<unknown>> = P extends Parser<unknown, any, infer C> ? C : never;
export type SubData<P extends Parser<unknown>> = ExtractData<SubParsers<P>>;
export type IntermediateParser<P extends Parser<unknown>> = Parser<SubData<P>, SubParsers<P>, Context<P>>;
type ExtractData<D extends Parser<unknown>[]> = ExtractParser<D> extends infer T ? T extends Parser<infer U> ? U : never : never;
type ExtractParser<D extends Parser<unknown>[]> = D extends (infer P)[] ? P extends Parser<unknown> ? P : never : never;

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
  assert(source.slice(+mustConsume).slice(-exec(result, '').length || source.length) === exec(result, ''));
  return true;
}
