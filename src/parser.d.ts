export interface Parser<R, P extends Parser<any, any>[]> {
  (source: string): Result<R, P>;
}
export type Result<R, _ extends Parser<any, any>[]> = [R[], string] | [R[], string, _] | undefined;
