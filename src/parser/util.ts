import { min } from 'spica/alias';
import { Command } from './context';
import { Parser, Result, Ctx, Node, Context, eval, exec } from '../combinator/data/parser';
import { convert } from '../combinator';
import { define } from 'typed-dom/dom';

export function lineable<P extends Parser<HTMLElement | string>>(parser: P, fillTrailingLinebreak?: boolean): P;
export function lineable<N extends HTMLElement | string>(parser: Parser<N>, fillTrailingLinebreak = false): Parser<N> {
  return convert(
    source => `\r${source}${fillTrailingLinebreak && source.at(-1) !== '\n' ? '\n' : ''}`,
    parser,
    !fillTrailingLinebreak);
}

export function repeat<P extends Parser<HTMLElement | string>>(symbol: string, parser: P, cons: (nodes: Node<P>[], context: Context<P>) => Node<P>[], termination?: (acc: Node<P>[][], rest: string, prefix: number, postfix: number, state: boolean) => Result<string | Node<P>>): P;
export function repeat<N extends HTMLElement | string>(symbol: string, parser: Parser<N>, cons: (nodes: N[], context: Ctx) => N[], termination: (acc: N[][], rest: string, prefix: number, postfix: number, state: boolean) => Result<string | N> = (acc, rest, prefix, postfix) => {
  const nodes = [];
  if (prefix > 0) {
    nodes.push(symbol[0].repeat(prefix));
  }
  for (let i = 0; i < acc.length; ++i) {
    nodes.push(...acc[i]);
  }
  if (postfix > 0) {
    nodes.push(rest.slice(0, postfix));
    rest = rest.slice(postfix);
  }
  return [nodes, rest];
}): Parser<string | N> {
  return input => {
    const { source, context } = input;
    assert(source.startsWith(symbol));
    let acc: N[][] = [];
    let i = symbol.length;
    while (source[i] === source[0]) ++i;
    let rest = source.slice(i);
    let state = false;
    for (; i >= symbol.length; i -= symbol.length) {
      if (acc.length > 0 && rest.startsWith(symbol)) {
        acc = [cons(acc.flat(), context)];
        rest = rest.slice(symbol.length);
        continue;
      }
      const result = parser({ source: rest, context });
      if (result === undefined) break;
      const nodes = eval(result);
      rest = exec(result);
      acc.push(nodes);
      switch (nodes.at(-1)) {
        case Command.Escape:
          assert(!rest.startsWith(symbol));
          nodes.pop();
          state = false;
          break;
        case Command.Separator:
          assert(!rest.startsWith(symbol));
          nodes.pop();
          state = true;
          continue;
        default:
          acc = [cons(acc.flat(), context)];
          state = true;
          continue;
      }
      break;
    }
    if (acc.length === 0) return;
    const prefix = i;
    i = 0;
    for (let len = min(prefix, rest.length); i < len && rest[i] === symbol[0];) {
      ++i;
    }
    const postfix = i;
    return termination(acc, rest, prefix, postfix, state);
  };
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

export function stringify(nodes: readonly (HTMLElement | string)[]): string {
  let acc = '';
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
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
