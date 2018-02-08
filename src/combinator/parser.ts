export type Parser<R, S extends Parser<any, any>[]> = (source: string) => Result<R, S>;
export type Result<R, S extends Parser<any, any>[]> = [R[], string] | [R[], string, S] | undefined;
export type Data<P extends Parser<any, any>> = P extends Parser<infer R, any> ? R : never;
export type SubParsers<P extends Parser<any, any>> = P extends (...as: any[]) => Result<any, infer S> ? S : never;
