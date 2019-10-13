import { concat } from 'spica/concat';
import { html, frag } from 'typed-dom';

export function toc(source: DocumentFragment | HTMLElement | ShadowRoot): HTMLUListElement {
  const hs = [...source.children]
    .filter((el): el is HTMLHeadingElement =>
      el.id !== '' &&
      el instanceof HTMLHeadingElement);
  return parse(cons(hs));
}

type Tree = [HTMLHeadingElement, Tree][];

function parse(node: Tree, index: number[] = []): HTMLUListElement {
  return html('ul', node.map(([el, children], i) => {
    const idx = [...index, i + 1];
    return html('li', [
      html('a', { href: `#${el.id}`, rel: 'noopener', 'data-index': idx.join('.') }, el.textContent!),
      children.length > 0 ? parse(children, idx) : frag()
    ]);
  }));
}

function cons(hs: HTMLHeadingElement[]): Tree {
  return hs
    .reduce<HTMLHeadingElement[][]>((hss, h) => {
      const hs = hss.pop() || [];
      return hs.length === 0 || level(h) > level(hs[0])
        ? concat(hss, [concat(hs, [h])])
        : concat(hss, [hs, [h]]);
    }, [])
    .map(hs =>
      [hs.shift()!, cons(hs)]);
}

function level(h: HTMLHeadingElement): number {
  assert(isFinite(+h.tagName[1]));
  return +h.tagName[1];
}
