import { Parser, transform } from '../combinator';

export function compress<P extends Parser<Node, any>>(parser: P): P;
export function compress<T extends Node, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return transform(parser, (ns, rest) =>
    [squash(ns), rest]);
}

export function squash<T extends Node>(nodes: T[]): T[] {
  const acc: T[] = [];
  void nodes
    .reduce<Node | undefined>((prev, curr) => {
      if (prev) {
        if (curr.nodeType === 3 && curr.textContent === '') return prev;
        if (prev.nodeType === 3 && curr.nodeType === 3) {
          prev.textContent += curr.textContent!;
          curr.textContent = '';
          return prev;
        }
      }
      void acc.push(curr);
      return curr;
    }, undefined);
  assert(nodes.length > 0 ? acc.length > 0 : true);
  return acc;
}

export function hasContent(node: Element | DocumentFragment): boolean {
  return hasText(node)
      || hasMedia(node);
}

export function hasMedia(node: Element | DocumentFragment): boolean {
  return !!node.querySelector('.media');
}

export function hasLink(node: Element | DocumentFragment): boolean {
  return !!node.querySelector('a');
}

export function hasAnnotation(node: Element | DocumentFragment): boolean {
  return !!node.querySelector('.annotation');
}

export function hasText(node: Node): boolean {
  return node.textContent!.trim() !== '';
}

export function hasTightText(el: HTMLElement): boolean {
  return hasText(el)
      && el.textContent === el.textContent!.trim();
}

export function stringify(ns: Node[]): string {
  return ns.reduce((s, n) => s + n.textContent, '');
}
