import { min } from 'spica/alias';
import { MarkdownParser } from '../../markdown';
import { Command } from './context';
import { Parser, Result, List, Data, Ctx, Node, Context, eval, failsafe } from '../combinator/data/parser';
import { define } from 'typed-dom/dom';

export function* unwrap<N>(nodes: List<Data<N>>): Iterable<N> {
  for (const node of nodes) {
    yield node.value;
  }
}

export function repeat<P extends Parser<HTMLElement | string, MarkdownParser.Context>>(symbol: string, parser: P, cons: (nodes: List<Data<Node<P>>>, context: Context<P>) => List<Data<Node<P>>>, termination?: (acc: List<Data<Node<P>>>, context: Ctx, prefix: number, postfix: number, state: boolean) => Result<string | Node<P>>): P;
export function repeat<N extends HTMLElement | string>(symbol: string, parser: Parser<N>, cons: (nodes: List<Data<N>>, context: MarkdownParser.Context) => List<Data<N>>, termination: (acc: List<Data<N>>, context: Ctx, prefix: number, postfix: number, state: boolean) => Result<string | N, MarkdownParser.Context> = (nodes, context, prefix, postfix) => {
  const acc = new List<Data<string | N>>();
  if (prefix > 0) {
    acc.push(new Data(symbol[0].repeat(prefix)));
  }
  acc.import(nodes);
  if (postfix > 0) {
    const { source, position } = context;
    acc.push(new Data(source.slice(position, position + postfix)));
    context.position += postfix;
  }
  return acc;
}): Parser<string | N, MarkdownParser.Context> {
  return failsafe(input => {
    const { context } = input;
    const { source, position } = context;
    assert(source.startsWith(symbol, context.position));
    let nodes = new List<Data<N>>();
    let i = symbol.length;
    while (source[context.position + i] === source[context.position]) ++i;
    context.position += i;
    let state = false;
    for (; i >= symbol.length; i -= symbol.length) {
      if (nodes.length > 0 && source.startsWith(symbol, context.position)) {
        nodes = cons(nodes, context);
        context.position += symbol.length;
        continue;
      }
      const buf = context.buffer;
      context.buffer = nodes;
      const result = parser(input);
      context.buffer = buf;
      if (result === undefined) break;
      nodes = eval(result);
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
          nodes = cons(nodes, context);
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
