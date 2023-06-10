import { memoize, reduce } from 'spica/memoize';

export class Delimiters {
  public static signature(pattern: string | RegExp | undefined): string {
    switch (typeof pattern) {
      case 'undefined':
        return `undefined`;
      case 'string':
        return `s:${pattern}`;
      case 'object':
        return `r/${pattern.source}/${pattern.flags}`;
    }
  }
  public static matcher = memoize(
    (pattern: string | RegExp | undefined): (source: string) => true | undefined => {
      switch (typeof pattern) {
        case 'undefined':
          return () => undefined;
        case 'string':
          return source => source.slice(0, pattern.length) === pattern || undefined;
        case 'object':
          return reduce(source => pattern.test(source) || undefined);
      }
    },
    this.signature);
  private readonly registry = new Map<string, boolean>();
  private readonly matchers: [number, string, number, (source: string) => boolean | undefined][] = [];
  private length = 0;
  public push(
    ...delimiters: readonly {
      readonly signature: string;
      readonly matcher: (source: string) => boolean | undefined;
      readonly precedence?: number;
    }[]
  ): void {
    const { registry, matchers } = this;
    for (let i = 0; i < delimiters.length; ++i) {
      const delimiter = delimiters[i];
      assert(this.length >= this.matchers.length);
      const { signature, matcher, precedence = 1 } = delimiter;
      if (!registry.get(signature)) {
        matchers.push([this.length, signature, precedence, matcher]);
        registry.set(signature, true);
      }
      ++this.length;
    }
  }
  public pop(count = 1): void {
    assert(count > 0);
    const { registry, matchers } = this;
    for (let i = 0; i < count; ++i) {
      assert(this.matchers.length > 0);
      assert(this.length >= this.matchers.length);
      if (--this.length === matchers.at(-1)![0]) {
        registry.set(matchers.pop()![1], false);
      }
    }
  }
  public match(source: string, precedence = 1): boolean {
    const { matchers } = this;
    for (let i = 0; i < matchers.length; ++i) {
      const matcher = matchers[i];
      if (precedence >= matcher[2]) continue;
      switch (matcher[3](source)) {
        case true:
          return true;
        case false:
          return false;
        default:
          continue;
      }
    }
    return false;
  }
}
