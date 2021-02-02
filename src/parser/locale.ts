import { Parser, fmap } from '../combinator';
import { japanese } from './locale/ja';
import { html } from 'typed-dom';

export function localize<P extends Parser<HTMLElement | string>>(parser: P): P;
export function localize(parser: Parser<HTMLElement | string>): Parser<HTMLElement | string> {
  return fmap(parser, ns => {
    if (ns.length === 0) return ns;
    const el = ns.length === 1 && typeof ns[0] === 'object'
      ? ns[0]
      : html('div', ns);
    const es = el.getElementsByClassName('linebreak');
    for (let i = 0, len = es.length; i < len; ++i) {
      const sb = es[i];
      if (!sb.firstChild) continue;
      if (!check(sb)) continue;
      assert(sb.firstChild.textContent === ' ');
      sb.firstChild.remove();
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
    if ('id' in node && !node.firstChild) {
      switch (node.tagName) {
        case 'BR':
          return '';
        case 'SPAN':
          if (node.className === 'linebreak') return '';
      }
      continue;
    }
    const str = text(node);
    return str && [...str.slice(-2)].pop()!;
  }
  return '';
}

function text(node: Text | Element): string {
  if (!('id' in node)) return node.data;
  switch (node.tagName) {
    case 'RUBY':
      for (let ns = node.childNodes, i = ns.length; i--;) {
        const child = ns[i] as Text | Element;
        if ('id' in child) continue;
        return child.data;
      }
      assert(false);
      return '';
    default:
      return node.textContent!;
  }
}
