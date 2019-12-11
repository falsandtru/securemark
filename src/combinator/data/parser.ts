export type Parser<R, D extends Parser<unknown, any, S, C>[] = any, S extends object = object, C extends object = object>
  = (source: string, config: C) => Result<R, D, S, C>;
export type Result<R, D extends Parser<unknown, any, S, C>[] = any, S extends object = object, C extends object = object>
  = readonly [R[], string] | readonly [R[], string, S, C, D] | undefined;
export type Data<P extends Parser<unknown>> = P extends Parser<infer R> ? R : never;
export type SubParsers<P extends Parser<unknown>> = P extends Parser<unknown, infer D> ? D : never;
export type State<P extends Parser<unknown>> = P extends Parser<unknown, any, infer S, object> ? S : never;
export type Config<P extends Parser<unknown>> = P extends Parser<unknown, any, object, infer C> ? C : never;
export type SubData<P extends Parser<unknown>> = ExtractData<SubParsers<P>>;
export type IntermediateParser<P extends Parser<unknown>> = Parser<SubData<P>, SubParsers<P>, State<P>, Config<P>>;
type ExtractData<D extends Parser<unknown>[]> = ExtractParser<D> extends infer T ? T extends Parser<infer U> ? U : never : never;
type ExtractParser<D extends Parser<unknown>[]> = D extends (infer P)[] ? P extends Parser<unknown> ? P : never : never;

export { eval_ as eval };
function eval_<R>(result: Result<R>, default_: R[] = []): R[] {
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
