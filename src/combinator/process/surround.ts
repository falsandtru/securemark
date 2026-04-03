import { Parser, Result, Input, Output, List, Node } from '../parser';
import { tester } from '../delimiter';

export function surround<P extends Parser, S = string>(
  opener: string | RegExp | Parser<S, Parser.Input<P>>,
  parser: Parser.IntermediateParser<P>,
  closer: string | RegExp | Parser<S, Parser.Input<P>>,
  optional?: false,
  backtracks?: readonly number[],
  f?: (rss: [List<Node<S>>, List<Node<Parser.SubNode<P>>>, List<Node<S>>], input: Parser.Input<P>, output: Output<Parser.Node<P>>) => Result<Parser.Node<P>, Parser.Input<P>, Parser.SubParsers<P>>,
  g?: (rss: [List<Node<S>>, List<Node<Parser.SubNode<P>>> | undefined], input: Parser.Input<P>, output: Output<Parser.Node<P>>) => Result<Parser.Node<P>, Parser.Input<P>, Parser.SubParsers<P>>,
): P;
export function surround<P extends Parser, S = string>(
  opener: string | RegExp | Parser<S, Parser.Input<P>>,
  parser: Parser.IntermediateParser<P>,
  closer: string | RegExp | Parser<S, Parser.Input<P>>,
  optional?: boolean,
  backtracks?: readonly number[],
  f?: (rss: [List<Node<S>>, List<Node<Parser.SubNode<P>>> | undefined, List<Node<S>>], input: Parser.Input<P>, output: Output<Parser.Node<P>>) => Result<Parser.Node<P>, Parser.Input<P>, Parser.SubParsers<P>>,
  g?: (rss: [List<Node<S>>, List<Node<Parser.SubNode<P>>> | undefined], input: Parser.Input<P>, output: Output<Parser.Node<P>>) => Result<Parser.Node<P>, Parser.Input<P>, Parser.SubParsers<P>>,
): P;
export function surround<P extends Parser, S = string>(
  opener: string | RegExp | Parser<S, Parser.Input<P>>,
  parser: P,
  closer: string | RegExp | Parser<S, Parser.Input<P>>,
  optional?: false,
  backtracks?: readonly number[],
  f?: (rss: [List<Node<S>>, List<Node<Parser.Node<P>>>, List<Node<S>>], input: Parser.Input<P>, output: Output<Parser.Node<P>>) => Result<Parser.Node<P>, Parser.Input<P>, Parser.SubParsers<P>>,
  g?: (rss: [List<Node<S>>, List<Node<Parser.Node<P>>> | undefined], input: Parser.Input<P>, output: Output<Parser.Node<P>>) => Result<Parser.Node<P>, Parser.Input<P>, Parser.SubParsers<P>>,
): P;
export function surround<P extends Parser, S = string>(
  opener: string | RegExp | Parser<S, Parser.Input<P>>,
  parser: P,
  closer: string | RegExp | Parser<S, Parser.Input<P>>,
  optional?: boolean,
  backtracks?: readonly number[],
  f?: (rss: [List<Node<S>>, List<Node<Parser.Node<P>>> | undefined, List<Node<S>>], input: Parser.Input<P>, output: Output<Parser.Node<P>>) => Result<Parser.Node<P>, Parser.Input<P>, Parser.SubParsers<P>>,
  g?: (rss: [List<Node<S>>, List<Node<Parser.Node<P>>> | undefined], input: Parser.Input<P>, output: Output<Parser.Node<P>>) => Result<Parser.Node<P>, Parser.Input<P>, Parser.SubParsers<P>>,
): P;
export function surround<P extends Parser<string>, S = string>(
  opener: string | RegExp | Parser<S, Parser.Input<P>>,
  parser: string | RegExp | P,
  closer: string | RegExp | Parser<S, Parser.Input<P>>,
  optional?: false,
  backtracks?: readonly number[],
  f?: (rss: [List<Node<S>>, List<Node<Parser.Node<P>>>, List<Node<S>>], input: Parser.Input<P>, output: Output<Parser.Node<P>>) => Result<Parser.Node<P>, Parser.Input<P>, Parser.SubParsers<P>>,
  g?: (rss: [List<Node<S>>, List<Node<Parser.Node<P>>> | undefined], input: Parser.Input<P>, output: Output<Parser.Node<P>>) => Result<Parser.Node<P>, Parser.Input<P>, Parser.SubParsers<P>>,
): P;
export function surround<P extends Parser<string>, S = string>(
  opener: string | RegExp | Parser<S, Parser.Input<P>>,
  parser: string | RegExp | P,
  closer: string | RegExp | Parser<S, Parser.Input<P>>,
  optional?: boolean,
  backtracks?: readonly number[],
  f?: (rss: [List<Node<S>>, List<Node<Parser.Node<P>>> | undefined, List<Node<S>>], input: Parser.Input<P>, output: Output<Parser.Node<P>>) => Result<Parser.Node<P>, Parser.Input<P>, Parser.SubParsers<P>>,
  g?: (rss: [List<Node<S>>, List<Node<Parser.Node<P>>> | undefined], input: Parser.Input<P>, output: Output<Parser.Node<P>>) => Result<Parser.Node<P>, Parser.Input<P>, Parser.SubParsers<P>>,
): P;
export function surround<T>(
  opener: string | RegExp | Parser<T>,
  parser: string | RegExp | Parser<T>,
  closer: string | RegExp | Parser<T>,
  optional: boolean = false,
  backtracks: readonly number[] = [],
  f?: (rss: [List<Node<T>>, List<Node<T>>, List<Node<T>>], input: Input, output: Output<T>) => Result<T>,
  g?: (rss: [List<Node<T>>, List<Node<T>> | undefined], input: Input, output: Output<T>) => Result<T>,
): Parser<T> {
  switch (typeof opener) {
    case 'string':
    case 'object':
      opener = wrap(opener);
  }
  assert(opener);
  switch (typeof parser) {
    case 'string':
    case 'object':
      parser = wrap(parser);
  }
  assert(parser);
  switch (typeof closer) {
    case 'string':
    case 'object':
      closer = wrap(closer);
  }
  assert(closer);
  const [blen, rbs, wbs] = reduce(backtracks);
  interface Memory {
    readonly position: number;
    readonly linebreak: number;
    state: boolean;
  }
  const cont1: Result<T, Input<Memory>> = [
    (input, output) => {
      const { source, position, linebreak } = input;
      if (position === source.length) return Result.skip;
      input.linebreak = 0;
      input.memory = {
        position,
        linebreak,
        state: false,
      };
      output.push();
      return cont2;
    },
    (input, output) => {
      const { memory: { linebreak } } = input;
      if (output.state) {
        input.linebreak ||= linebreak;
      }
      else {
        input.linebreak = linebreak;
      }
      return output.context;
    },
  ];
  const cont2: Result<T, Input<Memory>> = [
    opener,
    (input, output) => {
      const { memory: { position } } = input;
      if (!output.state || rbs && isBacktrack(input, rbs, position, blen)) {
        output.pop();
        return;
      }
      output.push();
      return cont3;
    },
  ];
  const cont3: Result<T, Input<Memory>> = [
    parser,
    (input, output) => {
      const { state } = output;
      const { memory: { position } } = input;
      input.range = input.position - position;
      if (!output.state && !optional) {
        wbs && setBacktrack(input, wbs, position);
        const m = output.pop();
        const o = output.pop();
        if (!g) return;
        output.state = true;
        output.context = Result.succ;
        return g([o, state ? m : undefined], input, output);
      }
      input.memory.state = output.state;
      output.push();
      return cont4;
    },
  ];
  const cont4: Result<T, Input<Memory>> = [
    closer,
    (input, output) => {
      const { memory: { position, state } } = input;
      const c = output.pop();
      const m = output.pop();
      const o = output.pop();
      input.range = input.position - position;
      if (!output.state) {
        wbs && setBacktrack(input, wbs, position);
        if (!g) return;
        output.state = true;
        output.context = Result.succ;
        return g([o, state ? m : undefined], input, output);
      }
      if (input.range === 0) return;
      if (f) {
        return f([o, state ? m : undefined as any, c], input, output);
      }
      else {
        output.import(o.import(m).import(c));
        return output.context;
      }
    },
  ];
  return () => cont1;
}
export function open<P extends Parser>(
  opener: string | RegExp | Parser<Parser.Node<P>, Parser.Input<P>>,
  parser: P,
  optional?: boolean,
  backtracks?: readonly number[],
): P;
export function open<P extends Parser<string>>(
  opener: string | RegExp | Parser<Parser.Node<P>, Parser.Input<P>>,
  parser: string | RegExp | P,
  optional?: boolean,
  backtracks?: readonly number[],
): P;
export function open<N>(
  opener: string | RegExp | Parser<N, Input>,
  parser: string | RegExp | Parser<N>,
  optional?: boolean,
  backtracks: readonly number[] = [],
): Parser<N> {
  return surround(opener, parser as Parser<N>, '', optional, backtracks);
}
export function close<P extends Parser>(
  parser: P,
  closer: string | RegExp | Parser<Parser.Node<P>, Parser.Input<P>>,
  optional?: boolean,
  backtracks?: readonly number[],
): P;
export function close<P extends Parser<string>>(
  parser: string | RegExp | P,
  closer: string | RegExp | Parser<Parser.Node<P>, Parser.Input<P>>,
  optional?: boolean,
  backtracks?: readonly number[],
): P;
export function close<N>(
  parser: string | RegExp | Parser<N>,
  closer: string | RegExp | Parser<N, Input>,
  optional?: boolean,
  backtracks: readonly number[] = [],
): Parser<N> {
  return surround('', parser as Parser<N>, closer, optional, backtracks);
}

const commandsize = 2;
export function isBacktrack(
  input: Input,
  backtrack: number,
  position: number = input.position,
  length: number = 1,
): boolean {
  assert(1 & backtrack);
  assert(backtrack >>> commandsize);
  assert(0 < length && length < 3);
  const { backtracks, offset } = input;
  for (let i = 0; i < length; ++i) {
    if (backtracks[position + i + offset] & backtrack >>> commandsize) return true;
  }
  return false;
}
export function setBacktrack(
  input: Input,
  backtrack: number,
  position: number,
  length: number = 1,
): void {
  // バックトラックの可能性がなく記録不要の場合もあるが判別が面倒なので省略
  assert(2 & backtrack);
  assert(backtrack >>> commandsize);
  assert(0 < length && length < 3);
  const { backtracks, offset } = input;
  for (let i = 0; i < length; ++i) {
    backtracks[position + i + offset] |= backtrack >>> commandsize;
  }
}

function wrap<T>(pattern: string | RegExp): Parser<T> {
  const test = tester(pattern, true);
  return (input, output) => test(input, output) ? output.context : Result.fail;
}

function reduce(backtracks: readonly number[]): readonly [number, number, number] {
  let len = 1;
  let rbs = 0;
  let wbs = 0;
  for (const backtrack of backtracks) {
    if (backtrack >>> commandsize === 0) {
      len = backtrack;
      assert(len > 0);
      continue;
    }
    assert(backtrack >>> commandsize);
    if (1 & backtrack) {
      rbs |= backtrack;
    }
    if (2 & backtrack) {
      wbs |= backtrack;
    }
  }
  return [len, rbs, wbs];
}
