import { Parser, Input, List, Node, Context } from './parser';
import { consume } from './parser/context';

interface Delimiter {
  readonly memory: Delimiter[];
  readonly index: number;
  readonly tester: (input: Input) => boolean | undefined;
  readonly precedence: number;
  state: boolean;
}

export class Delimiters {
  // 手間を惜しまなければ規定のパターンはすべて配列のインデクスに変換可能。
  public static signature(pattern: undefined | string | RegExp): number | string {
    switch (typeof pattern) {
      case 'undefined':
        return 0;
      case 'string':
        assert(pattern !== '');
        assert(pattern !== '\x00');
        if (pattern.length === 1) return pattern.charCodeAt(0);
        return `s:${pattern}`;
      case 'object':
        return `r/${pattern.source}`;
    }
  }
  public static tester(pattern: string | RegExp | undefined, after?: string | RegExp): (input: Input<Context>) => true | undefined {
    switch (typeof pattern) {
      case 'undefined':
        return () => undefined;
      case 'string':
      case 'object':
        const test = tester(pattern, false);
        const verify = after ? tester(after, false) : undefined;
        return verify
          ? input => test(input) !== undefined && verify(input) !== undefined || undefined
          : input => test(input) !== undefined || undefined;
    }
  }
  private readonly tree: Record<number, Delimiter[]> = {};
  private readonly map: Map<string, Delimiter[]> = new Map();
  private registry(signature: number | string): Delimiter[] {
    if (typeof signature === 'number') {
      return this.tree[signature] ??= [];
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
      readonly tester: (input: Input) => boolean | undefined;
      readonly precedence: number;
    }[]
  ): void {
    const { delimiters, stack } = this;
    // シグネチャ数以下
    assert(delimiters.length < 100);
    for (let i = 0; i < delims.length; ++i) {
      const { signature, tester, precedence } = delims[i];
      const memory = this.registry(signature);
      const index = memory[0]?.index ?? delimiters.length;
      assert(memory.length === 0 || precedence === delimiters[index].precedence);
      if (memory.length === 0) {
        const delimiter: Delimiter = {
          memory,
          index,
          tester,
          precedence,
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
  public test(input: Input): boolean {
    const { precedence } = input;
    const { delimiters } = this;
    for (let i = delimiters.length; i--;) {
      const delimiter = delimiters[i];
      if (delimiter.precedence <= precedence || !delimiter.state) continue;
      switch (delimiter.tester(input)) {
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

export function matcher(pattern: string | RegExp, advance: boolean, after?: Parser<string>): Parser<string> {
  assert(pattern instanceof RegExp ? !pattern.flags.match(/[gm]/) && pattern.sticky && !pattern.source.startsWith('^') : true);
  const count = typeof pattern === 'object'
    ? /[^^\\*+][*+]|{\d+,}/.test(pattern.source)
    : false;
  switch (typeof pattern) {
    case 'string':
      if (pattern === '') return () => new List([new Node(pattern)]);
      return input => {
        const context = input;
        const { source, position } = context;
        if (!source.startsWith(pattern, position)) return;
        if (advance) {
          context.position += pattern.length;
        }
        const next = after?.(input);
        return after
          ? next && new List([new Node(pattern)]).import(next)
          : new List([new Node(pattern)]);
      };
    case 'object':
      assert(pattern.sticky);
      return input => {
        const context = input;
        const { source, position } = context;
        pattern.lastIndex = position;
        if (!pattern.test(source)) return;
        const src = source.slice(position, pattern.lastIndex);
        count && consume(src.length, context);
        if (advance) {
          context.position += src.length;
        }
        const next = after?.(input);
        return after
          ? next && new List([new Node(src)]).import(next)
          : new List([new Node(src)]);
      };
  }
}

export function tester(pattern: string | RegExp, advance: boolean, after?: Parser<unknown>): Parser<never> {
  assert(pattern instanceof RegExp ? !pattern.flags.match(/[gm]/) && pattern.sticky && !pattern.source.startsWith('^') : true);
  const count = typeof pattern === 'object'
    ? /[^^\\*+][*+]|{\d+,}/.test(pattern.source)
    : false;
  switch (typeof pattern) {
    case 'string':
      if (pattern === '') return () => new List();
      return input => {
        const context = input;
        const { source, position } = context;
        if (!source.startsWith(pattern, position)) return;
        if (advance) {
          context.position += pattern.length;
        }
        if (after && after(input) === undefined) return;
        return new List();
      };
    case 'object':
      assert(pattern.sticky);
      return input => {
        const context = input;
        const { source, position } = context;
        pattern.lastIndex = position;
        if (!pattern.test(source)) return;
        const len = pattern.lastIndex - position;
        count && consume(len, context);
        if (advance) {
          context.position += len;
        }
        if (after && after(input) === undefined) return;
        return new List();
      };
  }
}
