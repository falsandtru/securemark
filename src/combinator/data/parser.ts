export type Parser<R, D extends Parser<unknown, any, C>[], C extends object> = (source: string, config: C) => Result<R, D, C>;
export type Result<R, D extends Parser<unknown, any, C>[], C extends object> = readonly [R[], string, C] | readonly [R[], string, C, D] | undefined;
export type Data<P extends Parser<unknown, any, object>> = P extends Parser<infer R, any, object> ? R : never;
export type SubParsers<P extends Parser<unknown, any, object>> = P extends Parser<unknown, infer D, object> ? D : never;
export type Config<P extends Parser<unknown, any, object>> = P extends Parser<any, any, infer C> ? C : never;
export type SubData<P extends Parser<unknown, any, object>> = ExtractData<SubParsers<P>>;
export type SubParser<P extends Parser<unknown, any, object>> = Parser<SubData<P>, SubParsers<P>, Config<P>>;
export type ExtractData<D extends Parser<unknown, any, object>[]> = ExtractData_<ExtractParser<D>>;
type ExtractData_<P extends Parser<unknown, any, object>> = P extends Parser<infer T, any, object> ? T : never;
type ExtractParser<D extends Parser<unknown, any, object>[]> = D extends (infer P)[] ? P extends Parser<unknown, any, object> ? P : never : never;

export { eval_ as eval };
function eval_<R>(result: Result<R, any, object>, default_: R[] = []): R[] {
  return result
    ? result[0]
    : default_;
}

export function exec(result: Result<unknown, any, object>, default_: string = ''): string {
  return result
    ? result[1]
    : default_;
}

export function config<C extends object>(result: NonNullable<Result<unknown, any, C>>): C {
  return result[2]
}

export function check(source: string, result: Result<unknown, any, object>, mustConsume = true): true {
  assert(source.slice(mustConsume ? 1 : 0).endsWith(exec(result)));
  return true;
}
