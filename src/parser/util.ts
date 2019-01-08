import { Parser, fmap } from '../combinator';
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

export function trim<P extends Parser<HTMLElement | Text, any>>(parser: P): P;
export function trim<T extends HTMLElement | Text, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return trimStart(trimEnd(parser));
}

export function trimStart<P extends Parser<HTMLElement | Text, any>>(parser: P): P;
export function trimStart<T extends HTMLElement | Text, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return trim_(parser, 'start');
}

export function trimEnd<P extends Parser<HTMLElement | Text, any>>(parser: P): P;
export function trimEnd<T extends HTMLElement | Text, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return trim_(parser, 'end');
}

function trim_<P extends Parser<HTMLElement | Text, any>>(parser: P, mode: 'start' | 'end'): P;
function trim_<T extends HTMLElement | Text, S extends Parser<any, any>[]>(parser: Parser<T, S>, mode: 'start' | 'end'): Parser<T, S> {
  return fmap(parser, ns => {
    if (ns.length === 0) return ns;
    const node = ns[mode === 'start' ? 0 : ns.length - 1];
    switch (node.nodeType) {
      case 3:
        const text = node.textContent!;
        if (text === '') return ns;
        switch (mode) {
          case 'start':
            //node.textContent = text.trimStart();
            node.textContent = text.slice(text.lastIndexOf(text.trim()));
            break;
          case 'end':
            //node.textContent = text.trimEnd();
            node.textContent = text.slice(0, text.lastIndexOf(text.trim()) + text.trim().length);
            break;
        }
        break;
      case 1:
        switch (true) {
          case (node as HTMLElement).tagName === 'BR':
          case (node as HTMLElement).className === 'linebreak' && node.childNodes.length === 1:
            switch (mode) {
              case 'start':
                void ns.shift();
                break;
              case 'end':
                void ns.pop();
                break;
            }
            break;
        }
        break;
    }
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
      && node.textContent === node.textContent!.trim()
      && (!node.firstChild || node.firstChild.nodeType !== 1 || (node as HTMLElement).tagName !== 'BR')
      && (!node.firstChild || node.firstChild.nodeType !== 1 || (node as HTMLElement).tagName !== 'BR');
}
