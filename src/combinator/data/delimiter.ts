import { Parser, Input, List, Node, Context } from './parser';
import { spend } from './parser/context';

interface Delimiter {
  readonly memory: Delimiter[];
  readonly index: number;
  readonly tester: (input: Input) => boolean | undefined;
  readonly precedence: number;
  state: boolean;
}

const indexes = new Map();
function index(source: string): number {
  let x = 0;
  for (let i = 0; i < source.length; ++i) {
    const c = source.charCodeAt(i);
    x = x ^ c << 1 || ~x ^ c << 1; // 16+1bit
    assert(x !== 0);
    x ^= x << 13; // shift <= 32-17bit
    x ^= x >>> 17;
    x ^= x << 15;
  }
  x >>>= 3;
  x &= ~0 >>> 32 - 4;
  assert(x !== 0);
  assert(indexes.has(source) ? indexes.get(source) === x : indexes.set(source, x));
  return x;
}

export class Delimiters {
  // 手間を惜しまなければ規定のパターンはすべて配列のインデクスに変換可能。
  public static signature(pattern: undefined | string | RegExp): number {
    switch (typeof pattern) {
      case 'undefined':
        return 0;
      case 'string':
        assert(pattern !== '');
        return index(`'${pattern}`);
      case 'object':
        assert(pattern.flags.includes('y'));
        assert(/^yu?$/.test(pattern.flags));
        return index(`/${pattern.source}`);
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
  private readonly memories: Delimiter[][] = [];
  private registry(signature: number): Delimiter[] {
    assert(signature >= 0);
    assert(signature >>> 0 === signature);
    assert(signature >>> 16 === 0);
    return this.memories[signature] ??= [];
  }
  private readonly delimiters: Delimiter[] = [];
  private readonly stack: number[] = [];
  private readonly states: (readonly number[])[] = [];
  public push(
    delims: readonly {
      readonly signature: number;
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
        // 現状各優先順位は固定
        assert(memory.length === 1);
        stack.push(-1);
      }
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
      indexes.push(i);
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
  let sid = 0, pos = 0, index = -1;
  switch (typeof pattern) {
    case 'string':
      if (pattern === '') return () => new List([new Node(pattern)]);
      return input => {
        const context = input;
        const { SID, source, position } = context;
        const hit = SID === sid && position === pos;
        index = hit
          ? index
          : source.startsWith(pattern, position) ? position : -1;
        sid = SID;
        pos = position;
        if (index === -1) return;
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
        const { SID, source, position } = context;
        const hit = SID === sid && position === pos;
        pattern.lastIndex = position;
        index = hit
          ? index
          : pattern.test(source) ? pattern.lastIndex : -1;
        sid = SID;
        pos = position;
        if (index === -1) return;
        const src = source.slice(position, index);
        count && !hit && spend(context, src.length);
        if (advance) {
          context.position = index;
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
  let sid = 0, pos = 0, index = -1;
  switch (typeof pattern) {
    case 'string':
      if (pattern === '') return () => new List();
      return input => {
        const context = input;
        const { SID, source, position } = context;
        const hit = SID === sid && position === pos;
        index = hit
          ? index
          : source.startsWith(pattern, position) ? position : -1;
        sid = SID;
        pos = position;
        if (index === -1) return;
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
        const { SID, source, position } = context;
        const hit = SID === sid && position === pos;
        pattern.lastIndex = position;
        index = hit
          ? index
          : pattern.test(source) ? pattern.lastIndex : -1;
        sid = SID;
        pos = position;
        if (index === -1) return;
        const len = index - position;
        count && !hit && spend(context, len);
        if (advance) {
          context.position = index;
        }
        if (after && after(input) === undefined) return;
        return new List();
      };
  }
}
