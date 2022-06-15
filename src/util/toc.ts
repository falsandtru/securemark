import { undefined } from 'spica/global';
import { html } from 'typed-dom/dom';
import { push } from 'spica/array';

// Bug: Firefox
//const selector = 'h1 h2 h3 h4 h5 h6 aside.aside'.split(' ').map(s => `:scope > ${s}[id]`).join();
const selector = ':is(h1, h2, h3, h4, h5, h6, aside.aside)[id]';

export function toc(source: DocumentFragment | HTMLElement | ShadowRoot): HTMLUListElement {
  const hs = push([], source.querySelectorAll(selector))
    .map(el => {
      assert(el.parentNode === source);
      switch (el.tagName) {
        case 'ASIDE':
          return html(el.firstElementChild!.tagName.toLowerCase() as 'h1', { id: el.id, class: 'aside' }, el.firstElementChild!.cloneNode(true).childNodes);
        default:
          return el as HTMLHeadingElement;
      }
    });
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
      push(
        [html('a', { href: `#${el.id}`, 'data-index': isHeading ? idx : undefined }, fix(el))],
        cs.length > 0 ? [parse(cs, idx)] : []));
  }));
}

function cons(hs: HTMLHeadingElement[]): Tree {
  return hs
    .reduce<HTMLHeadingElement[][]>((hss, h) => {
      const hs = hss.pop() ?? [];
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
