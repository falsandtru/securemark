import { Parser, Result, List, Node, failsafe } from '../combinator/data/parser';
import { tester } from '../combinator/data/delimiter';
import { Context, Command } from './context';
import { min } from 'spica/alias';
import { rnd0Z } from 'spica/random';
import { define } from 'typed-dom/dom';

export function* unwrap<N>(nodes: List<Node<N>> | undefined): Iterable<N> {
  if (nodes === undefined) return;
  for (const node of nodes) {
    yield node.value;
  }
}

export function repeat<P extends Parser<HTMLElement | string, Context>>(symbol: string, after: string | RegExp, parser: P, cons: (nodes: List<Node<Parser.Node<P>>>, context: Parser.Context<P>, nest: boolean) => List<Node<Parser.Node<P>>>, termination?: (acc: List<Node<Parser.Node<P>>>, context: Context, prefix: number, postfix: number, state: boolean) => Result<string | Parser.Node<P>>): P;
export function repeat<N extends HTMLElement | string>(symbol: string, after: string | RegExp, parser: Parser<N>, cons: (nodes: List<Node<N>>, context: Context, nest: boolean) => List<Node<N>>, termination: (acc: List<Node<N>>, context: Context, prefix: number, postfix: number, state: boolean) => Result<string | N, Context> = (nodes, context, prefix, postfix) => {
  const acc = new List<Node<string | N>>();
  if (prefix > 0) {
    acc.push(new Node(symbol[0].repeat(prefix)));
  }
  acc.import(nodes);
  if (postfix > 0) {
    const { source, position } = context;
    acc.push(new Node(source.slice(position, position + postfix)));
    context.position += postfix;
  }
  return acc;
}): Parser<string | N, Context> {
  const test = tester(after, false);
  return failsafe(input => {
    const context = input;
    const { source, position } = context;
    if (!source.startsWith(symbol, context.position)) return;
    let nodes = new List<Node<N>>();
    let i = symbol.length;
    for (; source[context.position + i] === source[context.position];) ++i;
    context.position += i;
    if (test(input) === undefined) return;
    let state = false;
    for (; i >= symbol.length; i -= symbol.length) {
      if (nodes.length > 0 && source.startsWith(symbol, context.position)) {
        nodes = cons(nodes, context, i > symbol.length);
        context.position += symbol.length;
        continue;
      }
      const buf = context.buffer;
      context.buffer = nodes;
      const result = parser(input);
      context.buffer = buf;
      if (result === undefined) break;
      nodes = result;
      switch (nodes.last?.value) {
        case Command.Cancel:
          assert(!source.startsWith(symbol, context.position));
          nodes.pop();
          state = false;
          break;
        case Command.Separator:
          assert(!source.startsWith(symbol, context.position));
          nodes.pop();
          state = true;
          continue;
        default:
          nodes = cons(nodes, context, i > symbol.length);
          state = true;
          continue;
      }
      break;
    }
    if (nodes.length === 0) return;
    const prefix = i;
    i = 0;
    for (let len = min(prefix, source.length - context.position); i < len && source[context.position + i] === symbol[0];) {
      ++i;
    }
    const postfix = i;
    context.range = context.position - position;
    return termination(nodes, context, prefix, postfix, state);
  });
}

export function invalid(
  syntax: string,
  type: string,
  message: string,
): Record<string, string> {
  return {
    'data-invalid-syntax': syntax,
    'data-invalid-type': type,
    'data-invalid-message': message,
  };
}

export function markInvalid<N extends HTMLElement>(
  el: N,
  syntax: string,
  type: string,
  message: string,
): N {
  assert(!message.endsWith('.'));
  return define(el, {
    class: void el.classList.add('invalid'),
    'data-invalid-syntax': syntax,
    'data-invalid-type': type,
    'data-invalid-message': message,
  });
}

export function unmarkInvalid<N extends HTMLElement>(el: N): N {
  return define(el, {
    class: void el.classList.remove('invalid'),
    'data-invalid-syntax': null,
    'data-invalid-type': null,
    'data-invalid-message': null,
  });
}

export function stringify(nodes: Iterable<HTMLElement | string>): string {
  let acc = '';
  for (const node of nodes) {
    if (typeof node === 'string') {
      assert(!node.includes('\n'));
      acc += node;
    }
    else {
      assert(!node.matches('br') && !node.querySelector('br'));
      // NOTE: Doesn't reflect line breaks.
      acc += node.innerText;
    }
  }
  return acc;
}

export function randomID(): string {
  return `random-${rnd0Z(6)}`;
}
