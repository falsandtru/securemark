import { html } from 'typed-dom';
import { concat } from 'spica/concat';

export function toc(source: DocumentFragment | HTMLElement): HTMLUListElement {
  const hs = [...source.children]
    .filter((el): el is HTMLHeadingElement =>
      el instanceof HTMLHeadingElement);
  return parse(cons(hs));
}

interface Tree extends Array<HTMLHeadingElement | [HTMLHeadingElement, Tree]> { }

function parse(node: Tree): HTMLUListElement {
  return html('ul', node.map(node =>
    node instanceof Element
      ? html('li', [html('a', { href: `#${node.id}`, rel: 'noopener' }, node.textContent!)])
      : html('li', [html('a', { href: `#${node[0].id}`, rel: 'noopener' }, node[0].textContent!), parse(node[1])])));
}

function cons(hs: HTMLHeadingElement[]): Tree {
  return hs
    .reduce<HTMLHeadingElement[][]>((hss, h) => {
      const hs = hss[hss.length - 1];
      const [fst = undefined] = hs;
      !fst || level(h) > level(fst)
        ? void hs.push(h)
        : void hss.push([h]);
      return hss;
    }, [[]])
    .reduce<Tree>((node, hs) =>
      concat(
        node,
        hs.length > 1
          ? [[hs.shift()!, cons(hs)]]
          : hs)
    , []);

  function level(h: HTMLHeadingElement): number {
    return +h.tagName[1];
  }
}
