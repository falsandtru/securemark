import { memoize, reduce } from 'spica/memoize';

interface Delimiter {
  readonly index: number;
  readonly signature: string;
  readonly matcher: (source: string) => boolean | undefined;
  readonly precedence: number;
}

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
  private readonly registry = memoize<(signature: string) => Delimiter[]>(() => []);
  private readonly delimiters: Delimiter[] = [];
  private readonly order: number[] = [];
  public push(
    delims: readonly {
      readonly signature: string;
      readonly matcher: (source: string) => boolean | undefined;
      readonly precedence: number;
    }[]
  ): void {
    const { registry, delimiters, order } = this;
    for (let i = 0; i < delims.length; ++i) {
      const { signature, matcher, precedence } = delims[i];
      const stack = registry(signature);
      const index = stack[0]?.index ?? delimiters.length;
      if (stack.length === 0 || precedence > delimiters[index].precedence) {
        const delimiter: Delimiter = {
          index,
          signature,
          matcher,
          precedence,
        };
        delimiters[index] = delimiter;
        stack.push(delimiter);
        order.push(index);
      }
      else {
        order.push(-1);
      }
    }
  }
  public pop(count: number): void {
    assert(count > 0);
    const { registry, delimiters, order } = this;
    for (let i = 0; i < count; ++i) {
      assert(this.order.length > 0);
      const index = order.pop()!;
      if (index === -1) continue;
      const stack = registry(delimiters[index].signature);
      assert(stack.length > 0);
      if (stack.length === 1) {
        assert(index === delimiters.length - 1);
        assert(stack[0] === delimiters.at(-1));
        stack.pop();
        delimiters.pop();
      }
      else {
        stack.pop();
        delimiters[index] = stack.at(-1)!;
      }
    }
  }
  public match(source: string, precedence = 1): boolean {
    const { delimiters } = this;
    for (let i = 0; i < delimiters.length; ++i) {
      const delimiter = delimiters[i];
      if (precedence >= delimiter.precedence) continue;
      switch (delimiter.matcher(source)) {
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
