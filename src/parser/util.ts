import { Parser, convert, fmap } from '../combinator';
import { isFixed } from './inline';
import { frag } from 'typed-dom';

export function suppress<P extends Parser<HTMLElement, any>>(parser: P): P;
export function suppress<T extends HTMLElement, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return fmap(parser, es => {
    void es.forEach(target => {
      void target.querySelectorAll('[id]')
        .forEach(el =>
          !el.closest('.math') &&
          void el.removeAttribute('id'));
      void target.querySelectorAll('figure[data-label]:not([data-index])')
        .forEach(el =>
          !isFixed(el.getAttribute('data-label')!) &&
          void el.setAttribute('data-label', el.getAttribute('data-label')!.split('-')[0] + '-0'));
      void target.querySelectorAll('a[href^="#"]')
        .forEach(el =>
          void el.setAttribute('onclick', 'return false;'));
    });
    return es;
  });
}

export function dup<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T[], S> {
  return fmap(parser, ns => [ns]);
}

export function wrap<S extends Parser<any, any>[]>(parser: Parser<Node, S>): Parser<DocumentFragment, S> {
  return fmap(parser, ns => [frag(ns)]);
}

export function defrag<P extends Parser<Node, any>>(parser: P): P;
export function defrag<T extends Node, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return fmap(parser, squash);
}

export function trim<P extends Parser<Node, any>>(parser: P): P;
export function trim<T extends Node, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return trimStart(trimEnd(parser));
}

export function trimStart<P extends Parser<Node, any>>(parser: P): P;
export function trimStart<T extends Node, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return convert(
    //source => source.trimStart(),
    source => source.slice(source.indexOf(source.trim())),
    parser);
}

export function trimEnd<P extends Parser<Node, any>>(parser: P): P;
export function trimEnd<T extends Node, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return fmap(parser, ns => {
    if (ns.length === 0) return ns;
    const node = ns[ns.length - 1];
    if (node instanceof HTMLElement && node.className === 'linebreak') return ns.slice(0, -1);
    if (!(node instanceof Text)) return ns;
    const text = node.textContent!;
    if (text === '') return ns;
    //node.textContent = text.trimEnd();
    node.textContent = text.slice(0, text.lastIndexOf(text.trim()) + text.trim().length);
    return ns;
  });
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

export function stringify(nodes: Node[]): string {
  return nodes.reduce((acc, node) => acc + node.textContent!, '');
}

export function hasContent(node: HTMLElement | DocumentFragment): boolean {
  return hasText(node)
      || hasMedia(node);
}

export function hasMedia(node: HTMLElement | DocumentFragment): boolean {
  return !!node.querySelector('.media');
}

export function hasLink(node: HTMLElement | DocumentFragment): boolean {
  return !!node.querySelector('a, .annotation, .authority');
}

export function hasAnnotationOrAuthority(node: HTMLElement | DocumentFragment): boolean {
  return !!node.querySelector('.annotation, .authority');
}

export function hasText(node: HTMLElement | DocumentFragment | Text): boolean {
  return node.textContent!.trim() !== '';
}

export function hasTightText(node: HTMLElement | DocumentFragment | Text): boolean {
  return hasText(node)
      && node.textContent === node.textContent!.trim();
}
