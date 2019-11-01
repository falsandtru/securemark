import { Parser, fmap } from '../combinator';
import { frag, define, apply } from 'typed-dom';

export function hasContent(node: HTMLElement | DocumentFragment): boolean {
  return hasText(node)
      || !!node.querySelector('.media');
}

export function hasText(node: HTMLElement | DocumentFragment | Text): boolean {
  return node.textContent!.trim() !== '';
}

export function hasTightText(node: HTMLElement | DocumentFragment | Text): boolean {
  return hasText(node)
      && node.textContent === node.textContent!.trim();
}

export function dup<T, D extends Parser<unknown, any, C, S>[], C extends object, S extends object>(parser: Parser<T, D, C, S>): Parser<T[], D, C, S> {
  return fmap(parser, ns => [ns]);
}

export function wrap<D extends Parser<unknown, any, C, S>[], C extends object, S extends object>(parser: Parser<Node, D, C, S>): Parser<DocumentFragment, D, C, S> {
  return fmap(parser, ns => [frag(ns)]);
}

export function defrag<P extends Parser<Node>>(parser: P): P;
export function defrag<T extends Node, D extends Parser<unknown, any, C, S>[], C extends object, S extends object>(parser: Parser<T, D, C, S>): Parser<T, D, C, S> {
  return fmap(parser, nodes => {
    const acc: T[] = [];
    void nodes.reduce<T | undefined>((prev, curr) => {
      if (curr.nodeType === 3) {
        if (curr.textContent === '') return prev;
        if (prev?.nodeType === 3) return prev.textContent += curr.textContent! , prev;
      }
      curr = curr.nodeType === 3 ? curr.cloneNode() : curr;
      void acc.push(curr);
      return curr;
    }, undefined);
    return acc;
  });
}

export function trimNode<P extends Parser<HTMLElement | Text>>(parser: P): P;
export function trimNode<T extends HTMLElement | Text, D extends Parser<unknown, any, C, S>[], C extends object, S extends object>(parser: Parser<T, D, C, S>): Parser<T, D, C, S> {
  return trimNode_(trimNode_(parser, 'start'), 'end');
}

export function trimNodeEnd<P extends Parser<HTMLElement | Text>>(parser: P): P;
export function trimNodeEnd<T extends HTMLElement | Text, D extends Parser<unknown, any, C, S>[], C extends object, S extends object>(parser: Parser<T, D, C, S>): Parser<T, D, C, S> {
  return trimNode_(parser, 'end');
}

function trimNode_<P extends Parser<HTMLElement | Text>>(parser: P, mode: 'start' | 'end'): P;
function trimNode_<T extends HTMLElement | Text, D extends Parser<unknown, any, C, S>[], C extends object, S extends object>(parser: Parser<T, D, C, S>, mode: 'start' | 'end'): Parser<T, D, C, S> {
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
          case (node as HTMLElement).classList.contains('linebreak'):
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

export function stringify(nodes: Node[]): string {
  return nodes.reduce((acc, node) => acc + node.textContent, '');
}

export function suppress<T extends HTMLOListElement | DocumentFragment>(target: T): T {
  assert(!target.parentElement);
  assert(target instanceof DocumentFragment || target instanceof HTMLOListElement);
  if (target instanceof HTMLOListElement) {
    assert.deepStrictEqual([...target.querySelectorAll('.footnote')], [...target.querySelectorAll(':scope > li')]);
    assert.deepStrictEqual([...target.querySelectorAll('.footnote > sup:last-child > a')], [...target.querySelectorAll(':scope > .footnote[id] > sup:last-child > a[href]')]);
    void apply(target, '.footnote > sup:last-child > a', { href: null });
  }
  for (const child of target.children) {
    switch (child.tagName) {
      case 'DL':
        assert.deepStrictEqual([...child.querySelectorAll('dt')], [...child.querySelectorAll(':scope > dt')]);
        assert.deepStrictEqual([...child.querySelectorAll(':scope > dt')], [...child.querySelectorAll(':scope > dt[id]')]);
        void apply(child, 'dt', { id: null });
        continue;
      default:
        child.id && void define(child, { id: null });
        continue;
    }
  }
  void apply(target, 'a.index[href], a.label[href], .annotation[id], .annotation[id] > a[href], .reference[id], .reference[id] > a[href]', { id: null, href: null });
  return target;
}
