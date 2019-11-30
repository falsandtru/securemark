import { Parser, fmap } from '../combinator';
import { define, apply } from 'typed-dom';

export function hasContent(node: HTMLElement): boolean {
  return hasText(node)
      || node.getElementsByClassName('media').length > 0;
}

export function hasText(node: HTMLElement | Text): boolean {
  return node.textContent!.trim() !== '';
}

export function hasTightText(node: HTMLElement | Text): boolean {
  return hasText(node)
      && node.textContent === node.textContent!.trim();
}

export function dup<T, D extends Parser<unknown, any, S, C>[], S extends object, C extends object>(parser: Parser<T, D, S, C>): Parser<T[], D, S, C> {
  return fmap(parser, ns => [ns]);
}

export function defrag<P extends Parser<Node>>(parser: P): P;
export function defrag<T extends Node, D extends Parser<unknown, any, S, C>[], S extends object, C extends object>(parser: Parser<T, D, S, C>): Parser<T, D, S, C> {
  return fmap(parser, nodes => {
    const acc: T[] = [];
    void nodes.reduce<T | undefined>((prev, curr) => {
      if (curr.nodeType === 3) {
        if (curr.textContent === '') return prev;
        if (prev?.nodeType === 3) return prev.textContent += curr.textContent!, prev;
      }
      void acc.push(curr);
      return curr;
    }, undefined);
    return acc;
  });
}

export function trimNodeEnd<P extends Parser<Node>>(parser: P): P;
export function trimNodeEnd<T extends Node, D extends Parser<unknown, any, S, C>[], S extends object, C extends object>(parser: Parser<T, D, S, C>): Parser<T, D, S, C> {
  return trimNode_(parser, 'end');
}

function trimNode_<P extends Parser<Node>>(parser: P, mode: 'start' | 'end'): P;
function trimNode_<T extends Node, D extends Parser<unknown, any, S, C>[], S extends object, C extends object>(parser: Parser<T, D, S, C>, mode: 'start' | 'end'): Parser<T, D, S, C> {
  return fmap(parser, ns => {
    if (ns.length === 0) return ns;
    const node = ns[mode === 'start' ? 0 : ns.length - 1];
    switch (node.nodeType) {
      case 3:
        const text = node.textContent!;
        assert(text !== '');
        switch (mode) {
          case 'start':
            if (stringify(ns.slice(0, 2)).length < 2) break;
            if (text[0]?.trim() === '') {
              if (text.length > 1) {
                node.textContent = text.slice(1);
              }
              else {
                void ns.shift();
              }
            }
            break;
          case 'end':
            if (stringify(ns.slice(-2)).length < 2) break;
            if (text[text.length - 1]?.trim() === '') {
              if (text.length > 1) {
                node.textContent = text.slice(0, -1);
              }
              else {
                void ns.pop();
              }
            }
            break;
        }
        break;
      case 1:
        switch (true) {
          case (node as Node as HTMLElement).tagName === 'BR':
          case (node as Node as HTMLElement).classList.contains('linebreak'):
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
