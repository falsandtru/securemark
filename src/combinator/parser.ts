export type Parser<R, P extends Parser<any, any>[]> = (source: string) => Result<R, P>;
export type Result<R, P extends Parser<any, any>[]> = [R[], string] | [R[], string, P] | undefined;
export type Data<P extends Parser<any, any>> = P extends Parser<infer R, any> ? R : never;
//export type SubParsers<P extends Parser<any, any>> = P extends (...as: any[]) => Result<any, infer R> ? R : never;
export type SubParsers<P extends Parser<any, any>> = P extends (...as: any[]) => [any, any] | [any, any, infer R] | undefined ? R : never;
