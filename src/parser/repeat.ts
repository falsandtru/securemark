import { Parser, Result, List, Node } from '../combinator/data/parser';
import { tester } from '../combinator/data/delimiter';
import { recur } from '../combinator';
import { Context, Recursion, Command } from './context';
import { min } from 'spica/alias';

export function repeat<P extends Parser<HTMLElement | string, Context>>(
  opener: string, after: string | RegExp, closer: string, recursion: Recursion, parser: P,
  cons: (nodes: List<Node<Parser.Node<P>>>, context: Parser.Context<P>, lead: number, follow: number) =>
    List<Node<Parser.Node<P>>>,
  termination?: (acc: List<Node<Parser.Node<P>>>, context: Context, prefix: number, postfix: number, state: boolean) =>
    Result<string | Parser.Node<P>>,
): P;
export function repeat<N extends HTMLElement | string>(
  opener: string, after: string | RegExp, closer: string, recursion: Recursion, parser: Parser<N>,
  cons: (nodes: List<Node<N>>, context: Context, lead: number, follow: number) =>
    List<Node<N>>,
  termination: (acc: List<Node<N>>, context: Context, prefix: number, postfix: number, state: boolean) =>
    Result<string | N, Context> =
    (nodes, context, prefix, postfix) => {
      const acc = new List<Node<string | N>>();
      if (prefix > 0) {
        acc.push(new Node(opener[0].repeat(prefix)));
        context.range += prefix;
      }
      acc.import(nodes);
      if (postfix > 0) {
        const { source, position } = context;
        acc.push(new Node(source.slice(position, position + postfix)));
        context.position += postfix;
        context.range += postfix;
      }
      return acc;
    },
): Parser<string | N, Context> {
  const test = tester(after, false);
  return input => {
    const context = input;
    const { source, position, resources: { recursions } } = context;
    if (!source.startsWith(opener, context.position)) return;
    let nodes = new List<Node<N>>();
    let i = opener.length;
    for (; source[context.position + i] === source[context.position];) ++i;
    context.position += i;
    if (test(input) === undefined) {
      context.position = position;
      return;
    }
    let depth = i / opener.length + 1 | 0;
    recur(recursions, recursion, depth, true);
    let state = false;
    let follow = 0;
    for (; i >= opener.length; i -= opener.length, follow -= closer.length) {
      recur(recursions, recursion, -1);
      depth -= 1;
      const lead = i - opener.length;
      if (source.startsWith(closer, context.position)) {
        context.position += closer.length;
        const pos = context.position;
        follow = follow > 0 ? follow : countFollows(source, pos, closer, lead / opener.length | 0);
        nodes = cons(nodes, context, lead, follow);
        if (context.position > pos) {
          const advance = context.position - pos;
          i -= advance;
          follow -= advance;
          depth -= advance / closer.length | 0;
        }
        continue;
      }
      const buf = context.buffer;
      context.buffer = nodes;
      const result = parser(input);
      context.buffer = buf;
      context.range = context.position - position - i + opener.length;
      if (result === undefined) break;
      const pos = context.position;
      nodes = result;
      switch (nodes.last?.value) {
        case Command.Cancel:
          assert(!source.startsWith(closer, context.position));
          nodes.pop();
          state = false;
          break;
        case Command.Separator:
          assert(!source.startsWith(closer, context.position));
          follow = follow > 0 ? follow : countFollows(source, pos, closer, lead / opener.length | 0);
          nodes.pop();
          state = true;
          continue;
        default:
          follow = follow > 0 ? follow : countFollows(source, pos, closer, lead / opener.length | 0);
          nodes = cons(nodes, context, lead, follow);
          state = true;
          if (context.position > pos) {
            const advance = context.position - pos;
            i -= advance;
            follow -= advance;
            depth -= advance / closer.length | 0;
          }
          continue;
      }
      break;
    }
    recur(recursions, recursion, -depth);
    depth = 0;
    const prefix = i;
    i = 0;
    for (let len = min(prefix, source.length - context.position); i < len && source[context.position + i] === closer[0];) {
      ++i;
    }
    const postfix = i;
    context.range = context.position - position - prefix;
    return termination(nodes, context, prefix, postfix, state);
  };
}

function countFollows(source: string, position: number, closer: string, limit: number): number {
  if (closer.length === 0) return 0;
  let pos = position;
  for (let i = 0; i < limit && pos < source.length; ++i, pos += closer.length) {
    if (!source.startsWith(closer, pos)) break;
  }
  return pos - position;
}
