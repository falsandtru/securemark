import { undefined } from 'spica/global';
import { html } from 'typed-dom';
import { push } from 'spica/array';

export function toc(source: DocumentFragment | HTMLElement | ShadowRoot): HTMLUListElement {
  // Bug: Firefox
  //const hs = [...source.querySelectorAll([...Array(6)].map((_, i) => `h${i + 1}[id]`).concat('aside.aside[id]').map(q => `:scope > ${q}`).join())]
  const hs = [...source.children]
    .reduce<HTMLHeadingElement[]>((acc, el) => {
      switch (el.id && el.tagName) {
        case 'H1':
        case 'H2':
        case 'H3':
        case 'H4':
        case 'H5':
        case 'H6':
          return push(acc, [el as HTMLHeadingElement]);
        case 'ASIDE':
          return el.classList.contains('aside')
            ? push(acc, [html(`h${acc[acc.length - 1]?.tagName[1] || 1}` as 'h1', { id: el.id, class: 'aside' }, el.firstElementChild!.cloneNode(true).childNodes)])
            : acc;
        default:
          return acc;
      }
    }, []);
  return parse(cons(hs));
}

type Tree = readonly [HTMLHeadingElement, Tree][];

function parse(node: Tree, index: string = ''): HTMLUListElement {
  let i = 0;
  return html('ul', node.map(([el, cs]) => {
    const isHeading = !el.classList.contains('aside');
    const idx = isHeading
      ? index === ''
        ? `${++i}`
        : `${index}.${++i}`
      : index === ''
        ? `${i}`
        : `${index}.${i}`;
    return html('li',
      push<HTMLElement>(
        [html('a', { href: `#${el.id}`, rel: 'noopener', 'data-index': isHeading ? idx : undefined }, fix(el))],
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

function fix(h: HTMLHeadingElement): Iterable<Node> {
  h = h.cloneNode(true);
  for (let es = h.getElementsByTagName('a'), i = 0, len = es.length; i < len; ++i) {
    const el = es[i];
    el.replaceWith(...el.childNodes);
  }
  return h.childNodes;
}
