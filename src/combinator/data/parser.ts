export type Parser<R, D extends Parser<unknown, any, C, S>[], C extends object, S extends object> = (source: string, config: C) => Result<R, D, C, S>;
export type Result<R, D extends Parser<unknown, any, C, S>[], C extends object, S extends object> = readonly [R[], string, C] | readonly [R[], string, C, D] | undefined;
export type Data<P extends Parser<unknown, any, object, object>> = P extends Parser<infer R, any, object, object> ? R : never;
export type SubParsers<P extends Parser<unknown, any, object, object>> = P extends Parser<unknown, infer D, object, object> ? D : never;
export type Config<P extends Parser<unknown, any, object, object>> = P extends Parser<any, any, infer C, object> ? C : never;
export type State<P extends Parser<unknown, any, object, object>> = P extends Parser<any, any, object, infer S> ? S : never;
export type SubData<P extends Parser<unknown, any, object, object>> = ExtractData<SubParsers<P>>;
export type SubParser<P extends Parser<unknown, any, object, object>> = Parser<SubData<P>, SubParsers<P>, Config<P>, object>;
export type ExtractData<D extends Parser<unknown, any, object, object>[]> = ExtractData_<ExtractParser<D>>;
type ExtractData_<P extends Parser<unknown, any, object, object>> = P extends Parser<infer T, any, object, object> ? T : never;
type ExtractParser<D extends Parser<unknown, any, object, object>[]> = D extends (infer P)[] ? P extends Parser<unknown, any, object, object> ? P : never : never;

export { eval_ as eval };
function eval_<R>(result: Result<R, any, object, object>, default_: R[] = []): R[] {
  return result
    ? result[0]
    : default_;
}

export function exec(result: Result<unknown, any, object, object>, default_: string = ''): string {
  return result
    ? result[1]
    : default_;
}

export function config<C extends object>(result: NonNullable<Result<unknown, any, C, object>>): C {
  return result[2];
}

export function state<S extends object>(result: NonNullable<Result<unknown, any, object, S>>): S {
  return result[3];
}

export function check(source: string, result: Result<unknown, any, object, object>, mustConsume = true): true {
  assert(source.slice(mustConsume ? 1 : 0).endsWith(exec(result)));
  return true;
}
