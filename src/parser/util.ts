import { Parser, fmap } from '../combinator';

export function compress<P extends Parser<Node, any>>(parser: P): P;
export function compress<T extends Node, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return fmap<T, T, S>(parser, squash);
}

export function squash<T extends Node>(nodes: T[]): T[];
export function squash(nodes: Node[]): Node[] {
  const acc: Node[] = [];
  void nodes
    .reduce<Node | undefined>((prev, curr) => {
      if (curr.nodeType === 3) {
        if (curr.textContent === '') return prev;
        if (prev && prev.nodeType === 3) return prev.textContent += curr.textContent!, prev;
      }
      curr = curr.nodeType === 3 ? curr.cloneNode() : curr;
      void acc.push(curr);
      return curr;
    }, undefined);
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

export function hasAnnotationOrAuthority(node: Element | DocumentFragment): boolean {
  return !!node.querySelector('.annotation, .authority');
}

export function hasText(node: Node): boolean {
  return node.textContent!.trim() !== '';
}

export function hasTightText(node: Node): boolean {
  return hasText(node)
      && node.textContent === node.textContent!.trim();
}

export function stringify(ns: Node[]): string {
  return ns.reduce((s, n) => s + n.textContent, '');
}
