import { Ctx } from '../../parser';

interface Delimiter {
  readonly memory: Delimiter[];
  readonly index: number;
  readonly signature: number | string;
  readonly matcher: (source: string) => boolean | undefined;
  readonly precedence: number;
  readonly linebreakable: boolean;
  state: boolean;
}

export class Delimiters {
  // 手間を惜しまなければ規定のパターンはすべて配列のインデクスに変換可能。
  public static signature(pattern: string | RegExp | undefined, linebreakable: boolean): number | string {
    switch (typeof pattern) {
      case 'undefined':
        return +linebreakable;
      case 'string':
        assert(pattern !== '\x00');
        if (pattern.length === 1) {
          const code = pattern.charCodeAt(0);
          // 使用中のパターンの8ビット目が空いてるのでひとまずこうしとく
          if ((code & 1 << 7) === 0) return code | +linebreakable << 7;
        }
        return `s:${pattern}:${+linebreakable}`;
      case 'object':
        return `r/${pattern.source}/${+linebreakable}`;
    }
  }
  public static matcher(pattern: string | RegExp | undefined): (source: string) => true | undefined {
    switch (typeof pattern) {
      case 'undefined':
        return () => undefined;
      case 'string':
        return source => source.slice(0, pattern.length) === pattern || undefined;
      case 'object':
        return source => pattern.test(source) || undefined;
    }
  }
  private readonly heap: Record<number, Delimiter[]> = {};
  private readonly map: Map<string, Delimiter[]> = new Map();
  private registry(signature: number | string): Delimiter[] {
    if (typeof signature === 'number') {
      return this.heap[signature] ??= [];
    }
    else {
      const ds = this.map.get(signature);
      if (ds) return ds;
      const blank: Delimiter[] = [];
      this.map.set(signature, blank);
      return blank;
    }
  }
  private readonly delimiters: Delimiter[] = [];
  private readonly stack: number[] = [];
  private readonly states: (readonly number[])[] = [];
  public push(
    delims: readonly {
      readonly signature: number | string;
      readonly matcher: (source: string) => boolean | undefined;
      readonly precedence: number;
      readonly linebreakable: boolean;
    }[]
  ): void {
    const { delimiters, stack } = this;
    // シグネチャ数以下
    assert(delimiters.length < 100);
    for (let i = 0; i < delims.length; ++i) {
      const { signature, matcher, precedence, linebreakable } = delims[i];
      const memory = this.registry(signature);
      const index = memory[0]?.index ?? delimiters.length;
      assert(memory.length === 0 || precedence === delimiters[index].precedence);
      if (memory.length === 0) {
        const delimiter: Delimiter = {
          memory,
          index,
          signature,
          matcher,
          precedence,
          linebreakable,
          state: true,
        };
        delimiters[index] = delimiter;
        memory.push(delimiter);
        stack.push(index);
      }
      else {
        stack.push(-1);
      }
      // 現状各優先順位は固定
      assert(memory.length === 1);
    }
  }
  public pop(count: number): void {
    assert(count > 0);
    const { delimiters, stack } = this;
    for (let i = 0; i < count; ++i) {
      assert(this.stack.length > 0);
      const index = stack.pop()!;
      if (index === -1) continue;
      const { memory } = delimiters[index];
      assert(memory.length > 0);
      if (memory.length === 1) {
        assert(index === delimiters.length - 1);
        assert(memory[0] === delimiters.at(-1));
        memory.pop();
        delimiters.pop();
      }
      else {
        assert(false);
        memory.pop();
        delimiters[index] = memory.at(-1)!;
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
  public match(source: string, { precedence = 0, linebreak = 0 }: Ctx): boolean {
    const { delimiters } = this;
    for (let i = delimiters.length; i--;) {
      const delimiter = delimiters[i];
      if (delimiter.precedence <= precedence || !delimiter.state) continue;
      switch (delimiter.matcher(source)) {
        case true:
          if (!delimiter.linebreakable && linebreak > 0) return false;
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
