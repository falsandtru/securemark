export type Parser<R, D extends Parser<unknown, any, C, S>[] = any, C extends object = object, S extends object = object> = (source: string, config: C, state: S) => Result<R, D, C, S>;
export type Result<R, D extends Parser<unknown, any, C, S>[] = any, C extends object = object, S extends object = object> = readonly [R[], string, C] | readonly [R[], string, C, S, D] | undefined;
export type Data<P extends Parser<unknown>> = P extends Parser<infer R> ? R : never;
export type SubParsers<P extends Parser<unknown>> = P extends Parser<unknown, infer D> ? D : never;
export type Config<P extends Parser<unknown>> = P extends Parser<any, any, infer C, object> ? C : never;
export type State<P extends Parser<unknown>> = P extends Parser<any, any, object, infer S> ? S : never;
export type SubData<P extends Parser<unknown>> = ExtractData<SubParsers<P>>;
export type SubParser<P extends Parser<unknown>> = Parser<SubData<P>, SubParsers<P>, Config<P>, object>;
export type ExtractData<D extends Parser<unknown>[]> = ExtractData_<ExtractParser<D>>;
type ExtractData_<P extends Parser<unknown>> = P extends Parser<infer T> ? T : never;
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

export function config<C extends object>(result: NonNullable<Result<unknown, any, C, object>>): C {
  return result[2];
}

export function check(source: string, result: Result<unknown>, mustConsume = true): true {
  assert(source.slice(mustConsume ? 1 : 0).endsWith(exec(result)));
  return true;
}
