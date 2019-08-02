import { Parser, fmap } from '../combinator';
import { isFixed } from './inline';
import { memoize as memoize_ } from 'spica/memoization';
import { frag, apply } from 'typed-dom';

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

export function hasInsOrDel(node: HTMLElement | DocumentFragment): boolean {
  return !!node.querySelector('ins, del');
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

export function dup<T, S extends Parser<unknown, any>[]>(parser: Parser<T, S>): Parser<T[], S> {
  return fmap(parser, ns => [ns]);
}

export function wrap<S extends Parser<unknown, any>[]>(parser: Parser<Node, S>): Parser<DocumentFragment, S> {
  return fmap(parser, ns => [frag(ns)]);
}

export function defrag<P extends Parser<Node, any>>(parser: P): P;
export function defrag<T extends Node, S extends Parser<unknown, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return fmap(parser, squash);
}

export function trimNode<P extends Parser<HTMLElement | Text, any>>(parser: P): P;
export function trimNode<T extends HTMLElement | Text, S extends Parser<unknown, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return trimNode_(parser, 'both');
}

export function trimNodeStart<P extends Parser<HTMLElement | Text, any>>(parser: P): P;
export function trimNodeStart<T extends HTMLElement | Text, S extends Parser<unknown, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return trimNode_(parser, 'start');
}

export function trimNodeEnd<P extends Parser<HTMLElement | Text, any>>(parser: P): P;
export function trimNodeEnd<T extends HTMLElement | Text, S extends Parser<unknown, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return trimNode_(parser, 'end');
}

function trimNode_<P extends Parser<HTMLElement | Text, any>>(parser: P, mode: 'start' | 'end' | 'both'): P;
function trimNode_<T extends HTMLElement | Text, S extends Parser<unknown, any>[]>(parser: Parser<T, S>, mode: 'start' | 'end' | 'both'): Parser<T, S> {
  if (mode === 'both') return trimNode_(trimNode_(parser, 'start'), 'end');
  return fmap(parser, ns => {
    if (ns.length === 0) return ns;
    const node = ns[mode === 'start' ? 0 : ns.length - 1];
    switch (node.nodeType) {
      case 3:
        const text = node.textContent!;
        if (text === '') return ns;
        switch (mode) {
          case 'start':
            node.textContent = text[0].trim() === ''
              ? text.slice(1)
              : text;
            break;
          case 'end':
            node.textContent = text[text.length - 1].trim() === ''
              ? text.slice(0, -1)
              : text;
            break;
        }
        break;
      case 1:
        switch (true) {
          case (node as HTMLElement).tagName === 'BR':
          case (node as HTMLElement).className === 'linebreak':
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

export function suppress<T extends HTMLElement | DocumentFragment>(el: T): T {
  for (const child of el.children) {
    if (child.matches('blockquote, .example')) continue;
    if (child.matches('[id]')) {
      void child.removeAttribute('id');
    }
    if (child.matches('figure[data-label]:not([data-index])') && !isFixed(child.getAttribute('data-label')!)) {
      void child.setAttribute('data-label', child.getAttribute('data-label')!.split('-', 1)[0] + '-0');
    }
    if (child.matches('figure')) {
      //void suppress(child.querySelector(':scope > figcaption') as HTMLElement);
      void suppress(child.lastElementChild as HTMLElement);
      continue;
    }
    void apply(child, '[id]', { id: null });
    void apply(child, 'a[href^="#"]', { onclick: 'return false;' });
  }
  return el;
}

export function memoize<a, b, c>(f: (a: a) => b, g: (b: b) => c): (a: a) => c {
  g = memoize_(g);
  return a => g(f(a));
}
