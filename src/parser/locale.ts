import { Parser } from '../combinator/data/parser';
import { fmap } from '../combinator';
import { japanese } from './locale/ja';
import { html } from 'typed-dom/dom';

export function localize<P extends Parser<HTMLElement | string>>(parser: P): P;
export function localize(parser: Parser<HTMLElement | string>): Parser<HTMLElement | string> {
  return fmap(parser, ns => {
    if (ns.length === 0) return ns;
    const el = ns.length === 1 && typeof ns[0] === 'object'
      ? ns[0]
      : html('div', ns);
    const es = el.querySelectorAll('.linebreak:not(:empty)');
    for (let i = 0, len = es.length; i < len; ++i) {
      const sb = es[i];
      assert(sb.firstChild!.textContent === ' ');
      if (!check(sb)) continue;
      sb.firstChild!.remove();
    }
    return ns;
  });
}

function check(el: Element): boolean {
  const char = lastChar(el);
  if (!char) return false;
  assert([...char].length === 1);
  return japanese(char);
}

function lastChar(node: Element | Text | null): string {
  while (node = node?.previousSibling as typeof node) {
    if (!('id' in node)) return [...node.data.slice(-2)].pop() ?? '';
    if (node.firstChild) return [...text(node).slice(-2)].pop() ?? '';
    switch (node.tagName) {
      case 'BR':
        return '';
      case 'SPAN':
        switch (node.className) {
          case 'linebreak':
            return '';
        }
    }
  }
  return '';
}

function text(el: Element): string {
  switch (el.tagName) {
    case 'RUBY':
      for (let ns = el.childNodes, i = ns.length; i--;) {
        const child = ns[i] as Text | Element;
        if ('id' in child) continue;
        return child.data;
      }
      assert(false);
      return '';
    default:
      return el.textContent!;
  }
}
