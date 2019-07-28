export type Parser<R, S extends Parser<unknown, any>[]> = (source: string) => Result<R, S>;
export type Result<R, S extends Parser<unknown, any>[]> = readonly [R[], string] | readonly [R[], string, S] | undefined;
export type Data<P extends Parser<unknown, any>> = P extends Parser<infer R, any> ? R : never;
export type SubData<P extends Parser<unknown, any>> = ExtractData<SubParsers<P>>;
export type SubParsers<P extends Parser<unknown, any>> = P extends Parser<unknown, infer S> ? S : never;
export type SubParser<P extends Parser<unknown, any>> = Parser<SubData<P>, SubParsers<P>>;
export type ExtractData<S extends Parser<unknown, any>[]> = ExtractData_<ExtractParser<S>>;
type ExtractData_<P extends Parser<unknown, any>> = P extends Parser<infer T, any> ? T : never;
type ExtractParser<S extends Parser<unknown, any>[]> = S extends (infer P)[] ? P extends Parser<unknown, any> ? P : never : never;

export { eval_ as eval };
function eval_<R>(result: Result<R, any>, default_: R[] = []): R[] {
  return result
    ? result[0]
    : default_;
}

export function exec(result: Result<unknown, any>, default_: string = ''): string {
  return result
    ? result[1]
    : default_;
}

export function verify(source: string, result: Result<unknown, any>, mustConsume = true): true {
  assert(source.slice(mustConsume ? 1 : 0).endsWith(exec(result)));
  return true;
}
