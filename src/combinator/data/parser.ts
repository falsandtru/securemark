export type Parser<T, C extends Ctx = Ctx, D extends Parser<unknown, C>[] = any>
  = (source: string, context: C) => Result<T, C, D>;
export type Result<T, C extends Ctx = Ctx, D extends Parser<unknown, C>[] = any>
  = readonly [T[], string, C, D]
  | readonly [T[], string]
  | undefined;
export interface Ctx {
  readonly resources?: {
    budget: number;
    recursion: number;
  };
  precedence?: number;
  delimiters?: Delimiters;
}
export type Tree<P extends Parser<unknown>> = P extends Parser<infer T> ? T : never;
export type SubParsers<P extends Parser<unknown>> = P extends Parser<unknown, Ctx, infer D> ? D : never;
export type Context<P extends Parser<unknown>> = P extends Parser<unknown, infer C> ? C : never;
export type SubTree<P extends Parser<unknown>> = ExtractSubTree<SubParsers<P>>;
export type IntermediateParser<P extends Parser<unknown>> = Parser<SubTree<P>, Context<P>, SubParsers<P>>;
type ExtractSubTree<D extends Parser<unknown>[]> = ExtractSubParser<D> extends infer T ? T extends Parser<infer U> ? U : never : never;
type ExtractSubParser<D extends Parser<unknown>[]> = D extends (infer P)[] ? P extends Parser<unknown> ? P : never : never;

export class Delimiters {
  private readonly matchers: [number, string, number, (source: string) => boolean | undefined][] = [];
  private readonly registry: Record<string, boolean> = {};
  private length = 0;
  public push(
    ...delimiters: readonly {
      readonly signature: string;
      readonly matcher: (source: string) => boolean | undefined;
      readonly precedence?: number;
    }[]
  ): void {
    for (let i = 0; i < delimiters.length; ++i) {
      const delimiter = delimiters[i];
      assert(this.length >= this.matchers.length);
      const { signature, matcher, precedence = 1 } = delimiter;
      if (!this.registry[signature]) {
        this.matchers.unshift([this.length, signature, precedence, matcher]);
        this.registry[signature] = true;
      }
      ++this.length;
    }
  }
  public pop(count = 1): void {
    assert(count > 0);
    for (let i = 0; i < count; ++i) {
      assert(this.matchers.length > 0);
      assert(this.length >= this.matchers.length);
      if (--this.length === this.matchers[0][0]) {
        this.registry[this.matchers.shift()![1]] = false;
      }
    }
  }
  public match(source: string, precedence = 1): boolean {
    const { matchers } = this;
    for (let i = 0; i < matchers.length; ++i) {
      switch (matchers[i][3](source)) {
        case true:
          if (precedence < matchers[i][2]) return true;
          continue;
        case false:
          return false;
      }
    }
    return false;
  }
}

export { eval_ as eval };
function eval_<T>(result: NonNullable<Result<T>>, default_?: T[]): T[];
function eval_<T>(result: Result<T>, default_: T[]): T[];
function eval_<T>(result: Result<T>, default_?: undefined): T[] | undefined;
function eval_<T>(result: Result<T>, default_?: T[]): T[] | undefined {
  return result
    ? result[0]
    : default_;
}

export function exec(result: NonNullable<Result<unknown>>, default_?: string): string;
export function exec(result: Result<unknown>, default_: string): string
export function exec(result: Result<unknown>, default_?: undefined): string | undefined;
export function exec(result: Result<unknown>, default_?: string): string | undefined {
  return result
    ? result[1]
    : default_;
}

export function check(source: string, result: Result<unknown>, mustConsume = true): true {
  assert.doesNotThrow(() => {
    if (source.slice(+mustConsume).slice(-exec(result, '').length || source.length) !== exec(result, '')) throw new Error();
  });
  return true;
}
