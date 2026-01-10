import { memoize, reduce } from 'spica/memoize';

interface Delimiter {
  readonly index: number;
  readonly signature: string;
  readonly matcher: (source: string) => boolean | undefined;
  readonly precedence: number;
  state: boolean;
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
  private readonly states: (readonly number[])[] = [];
  public push(
    delims: readonly {
      readonly signature: string;
      readonly matcher: (source: string) => boolean | undefined;
      readonly precedence: number;
    }[]
  ): void {
    const { registry, delimiters, order } = this;
    // 構文数x優先順位数以下
    assert(delimiters.length < 100);
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
          state: true,
        };
        delimiters[index] = delimiter;
        stack.push(delimiter);
        order.push(index);
      }
      else {
        order.push(-1);
      }
      // 現状各優先順位は固定
      assert(stack.length === 1);
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
  public shift(precedence: number): void {
    const { delimiters } = this;
    const indexes: number[] = [];
    for (let i = delimiters.length; i--;) {
      const delimiter = delimiters[i];
      if (delimiter.precedence >= precedence || !delimiter.state) continue;
      delimiter.state = false;
      indexes.push(i)
    }
    this.states.push(indexes);
  }
  public unshift(): void {
    const { delimiters } = this;
    const indexes = this.states.pop()!;
    for (let i = indexes.length; i--;) {
      delimiters[indexes[i]].state = true;
    }
  }
  public match(source: string, precedence = 0): boolean {
    const { delimiters } = this;
    for (let i = delimiters.length; i--;) {
      const delimiter = delimiters[i];
      if (delimiter.precedence <= precedence || !delimiter.state) continue;
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
