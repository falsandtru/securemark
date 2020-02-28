import { html } from 'typed-dom';
import { push, join } from 'spica/array';

const Tags = [...Array(6)].map((_, i) => `H${i + 1}`);

export function toc(source: DocumentFragment | HTMLElement | ShadowRoot): HTMLUListElement {
  const hs = [...source.children]
    .filter((el): el is HTMLHeadingElement =>
      el.id !== '' &&
      Tags.includes(el.tagName));
  return parse(cons(hs));
}

type Tree = readonly [HTMLHeadingElement, Tree][];

function parse(node: Tree, index: number[] = []): HTMLUListElement {
  return html('ul', node.map(([el, cs], i) => {
    const idx = push(index.slice(0), [i + 1]);
    return html('li',
      push<HTMLElement>(
        [html('a', { href: `#${el.id}`, rel: 'noopener', 'data-index': join(idx, '.') }, el.textContent!)],
        cs.length > 0 ? [parse(cs, idx)] : []));
  }));
}

function cons(hs: HTMLHeadingElement[]): Tree {
  return hs
    .reduce<HTMLHeadingElement[][]>((hss, h) => {
      const hs = hss.pop() || [];
      return hs.length === 0 || level(h) > level(hs[0])
        ? push(hss, [push(hs, [h])])
        : push(hss, [hs, [h]]);
    }, [])
    .map(hs =>
      [hs.shift()!, cons(hs)]);
}

function level(h: HTMLHeadingElement): number {
  assert(isFinite(+h.tagName[1]));
  return +h.tagName[1];
}
