export interface Ctx {
  readonly resources?: {
    creation: number;
  };
  delimiters?: ((source: string) => boolean)[];
}

export type Parser<R, D extends Parser<unknown, any, C>[] = any, C extends Ctx = Ctx>
  = (source: string, context: C) => Result<R, D, C>;
export type Result<R, D extends Parser<unknown, any, C>[] = any, C extends Ctx = Ctx>
  = readonly [R[], string]
  | readonly [R[], string, C, D]
  | undefined;
export type Data<P extends Parser<unknown>> = P extends Parser<infer R> ? R : never;
export type SubParsers<P extends Parser<unknown>> = P extends Parser<unknown, infer D> ? D : never;
export type Context<P extends Parser<unknown>> = P extends Parser<unknown, any, infer C> ? C : never;
export type SubData<P extends Parser<unknown>> = ExtractData<SubParsers<P>>;
export type IntermediateParser<P extends Parser<unknown>> = Parser<SubData<P>, SubParsers<P>, Context<P>>;
type ExtractData<D extends Parser<unknown>[]> = ExtractParser<D> extends infer T ? T extends Parser<infer U> ? U : never : never;
type ExtractParser<D extends Parser<unknown>[]> = D extends (infer P)[] ? P extends Parser<unknown> ? P : never : never;

export { eval_ as eval };
function eval_<R>(result: NonNullable<Result<R>>, default_?: unknown): R[];
function eval_<R>(result: Result<R>, default_: R[]): R[];
function eval_<R>(result: Result<R>, default_?: undefined): R[] | undefined;
function eval_<R>(result: Result<R>, default_?: R[]): R[] | undefined {
  return result
    ? result[0]
    : default_;
}

export function exec(result: Result<unknown>, default_: string = ''): string {
  return result
    ? result[1]
    : default_;
}

export function check(source: string, result: Result<unknown>, mustConsume = true): true {
  assert(source.slice(mustConsume ? 1 : 0).endsWith(exec(result)));
  return true;
}
