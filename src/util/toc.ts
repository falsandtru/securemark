import { html, frag } from 'typed-dom';
import { concat } from 'spica/concat';

export function toc(source: DocumentFragment | HTMLElement): HTMLUListElement {
  const hs = [...source.children]
    .filter((el): el is HTMLHeadingElement =>
      el instanceof HTMLHeadingElement);
  assert(hs.every(h => !!h.id));
  return parse(cons(hs));
}

interface Tree extends Array<[HTMLHeadingElement, Tree]> { }

function parse(node: Tree, index: number[] = []): HTMLUListElement {
  return html('ul', node.map(([el, node], i) => {
    const idx = index.concat([i + 1]);
    return html('li', [
      html('a', { href: `#${el.id}`, rel: 'noopener', 'data-index': idx.join('.') }, el.textContent!),
      node.length > 0 ? parse(node, idx) : frag()
    ]);
  }));
}

function cons(hs: HTMLHeadingElement[]): Tree {
  return hs
    .reduce<HTMLHeadingElement[][]>((hss, h) => {
      const hs = hss.pop()!;
      return hs.length === 0 || level(h) > level(hs[0])
        ? concat(hss, [concat(hs, [h])])
        : concat(hss, [hs, [h]]);
    }, [[]])
    .reduce<Tree>((node, hs) =>
      hs.length === 0
        ? node
        : concat<Tree[number]>(node, [[hs.shift()!, cons(hs)]])
    , []);

  function level(h: HTMLHeadingElement): number {
    assert(isFinite(+h.tagName[1]));
    return +h.tagName[1];
  }
}
