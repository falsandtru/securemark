import { List, Node } from '../combinator/data/parser';
import { rnd0Z } from 'spica/random';
import { define } from 'typed-dom/dom';

export function* unwrap<N>(nodes: List<Node<N>> | undefined): Iterable<N> {
  if (nodes === undefined) return;
  for (const node of nodes) {
    yield node.value;
  }
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
