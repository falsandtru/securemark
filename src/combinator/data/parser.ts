export type Parser<R, S extends Parser<any, any>[]> = (source: string) => Result<R, S>;
export type Result<R, S extends Parser<any, any>[]> = [R[], string] | [R[], string, S] | undefined;
export type Data<P extends Parser<any, any>> = P extends Parser<infer R, any> ? R : never;
export type SubData<P extends Parser<any, any>> = ExtractData<SubParsers<P>>;
export type SubParsers<P extends Parser<any, any>> = P extends Parser<any, infer S> ? S : never;
export type SubParser<P extends Parser<any, any>> = Parser<SubData<P>, SubParsers<P>>;
export type ExtractData<S extends Parser<any, any>[]> = ExtractData_<ExtractParser<S>>;
type ExtractData_<P extends Parser<any, any>> = P extends Parser<infer T, any> ? T : never;
type ExtractParser<S extends Parser<any, any>[]> = S extends (infer P)[] ? P extends Parser<any, any> ? P : never : never;

export { eval_ as eval };
function eval_<R>(result: Result<R, any>, default_: R[] = []): R[] {
  return (result || [default_])[0];
}

export function exec(result: Result<any, any>, default_: string = ''): string {
  return (result || [[], default_])[1];
}

export function validate(source: string, result: Result<any, any>): void {
  if (!result) return;
  assert(source.slice(1).endsWith(exec(result)));
}
