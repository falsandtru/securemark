import { Parser, Result, Output, List, Node } from '../combinator/parser';
import { tester } from '../combinator/delimiter';
import { recur } from '../combinator';
import { Input, Recursion, Command } from './context';
import { min } from 'spica/alias';

export function repeat<P extends Parser<HTMLElement | string, Input>>(
  opener: string, after: string | RegExp, closer: string, recursion: Recursion, parser: P,
  cons: (nodes: List<Node<Parser.Node<P>>>, input: Parser.Input<P>, output: Output<Parser.Node<P>>, lead: number, follow: number) =>
    List<Node<Parser.Node<P>>>,
  termination?: (nodes: List<Node<Parser.Node<P>>>, input: Input, output: Output<Parser.Node<P>>, prefix: number, postfix: number, state: boolean) =>
    Result<string | Parser.Node<P>>,
): P;
export function repeat<T extends HTMLElement | string>(
  opener: string, after: string | RegExp, closer: string, recursion: Recursion, parser: Parser<string | T>,
  cons: (nodes: List<Node<string | T>>, input: Input, output: Output<string | T>, lead: number, follow: number) =>
    List<Node<T>>,
  termination: (nodes: List<Node<string | T>>, input: Input, output: Output<string | T>, prefix: number, postfix: number, state: boolean) =>
    Result<string | T, Input> =
    (nodes, input, output, prefix, postfix) => {
      if (prefix > 0) {
        nodes.unshift(new Node(opener[0].repeat(prefix)));
        input.range += prefix;
      }
      if (postfix > 0) {
        const { source, position } = input;
        nodes.push(new Node(source.slice(position, position + postfix)));
        input.position += postfix;
        input.range += postfix;
      }
      return output.import(nodes);
    },
): Parser<string | T, Input> {
  const test = tester(after, false);
  interface Memory {
    readonly position: number;
    i: number;
    lead: number;
    follow: number;
    state: boolean;
    depth: number;
  }
  const cont: Result<T, Input<Memory>> = [
    (input, output) => {
      const { source, position, resources: { recursions } } = input;
      if (!source.startsWith(opener, input.position)) return Result.skip;
      let i = opener.length;
      for (; source[input.position + i] === source[input.position];) ++i;
      input.position += i;
      if (!test(input, output)) {
        input.position = position;
        return Result.skip;
      }
      const depth = i / opener.length + 1 | 0;
      recur(output, recursions, recursion, depth, true);
      input.memory = {
        position,
        i,
        lead: 0,
        follow: 0,
        state: false,
        depth,
      };
      output.push();
      return loop;
    },
    (input, output) => {
      const { source, memory: m, resources: { recursions } } = input;
      recur(output, recursions, recursion, -m.depth);
      m.depth = 0;
      const prefix = m.i;
      m.i = 0;
      for (let len = min(prefix, source.length - input.position); m.i < len && source[input.position + m.i] === closer[0];) {
        ++m.i;
      }
      const postfix = m.i;
      input.range = input.position - m.position - prefix;
      return termination(output.pop(), input, output, prefix, postfix, m.state);
    },
  ];
  const loop: Result<T, Input<Memory>> = [
    (input, output) => {
      const { source, memory: m, resources: { recursions } } = input;
      for (; m.i >= opener.length; m.i -= opener.length, m.follow -= closer.length) {
        recur(output, recursions, recursion, -1);
        m.depth -= 1;
        const lead = m.lead = m.i - opener.length;
        if (source.startsWith(closer, input.position)) {
          input.position += closer.length;
          const pos = input.position;
          m.follow = m.follow > 0 ? m.follow : countFollows(source, pos, closer, lead / opener.length | 0);
          output.push(cons(output.pop(), input, output, lead, m.follow));
          if (input.position > pos) {
            const advance = input.position - pos;
            m.i -= advance;
            m.follow -= advance;
            recur(output, recursions, recursion, -(advance / closer.length | 0));
            m.depth -= advance / closer.length | 0;
          }
          continue;
        }
        return output.context;
      }
      return Result.skip;
    },
    parser,
    (input, output) => {
      const { source, memory: m, resources: { recursions } } = input;
      const { lead } = m;
      input.range = input.position - m.position - m.i + opener.length;
      if (!output.state) return;
      const pos = input.position;
      const nodes = output.peek();
      switch (nodes.last?.value) {
        case Command.Cancel:
          assert(!source.startsWith(closer, input.position));
          nodes.pop();
          m.state = false;
          return;
        case Command.Separator:
          assert(!source.startsWith(closer, input.position));
          m.follow = m.follow > 0 ? m.follow : countFollows(source, pos, closer, lead / opener.length | 0);
          nodes.pop();
          m.state = true;
          m.i -= opener.length, m.follow -= closer.length;
          return loop;
        default:
          m.follow = m.follow > 0 ? m.follow : countFollows(source, pos, closer, lead / opener.length | 0);
          output.push(cons(output.pop(), input, output, lead, m.follow));
          m.state = true;
          if (input.position > pos) {
            const advance = input.position - pos;
            m.i -= advance;
            m.follow -= advance;
            recur(output, recursions, recursion, -(advance / closer.length | 0));
            m.depth -= advance / closer.length | 0;
          }
          m.i -= opener.length, m.follow -= closer.length;
          return loop;
      }
    },
  ];
  return () => cont;
}

function countFollows(source: string, position: number, closer: string, limit: number): number {
  if (closer.length === 0) return 0;
  let pos = position;
  for (let i = 0; i < limit && pos < source.length; ++i, pos += closer.length) {
    if (!source.startsWith(closer, pos)) break;
  }
  return pos - position;
}
