import { Parser, transform } from '../combinator';

export function compress<P extends Parser<Node, any>>(parser: P): P;
export function compress<T extends Node, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return transform(parser, (ns, rest) =>
    [squash(ns), rest]);
}

export function squash<T extends Node[]>(nodes: T): T;
export function squash<T extends Node[], U extends DocumentFragment>(nodes: T, container: U): U;
export function squash<T extends Node[], U extends T | Node>(nodes: T, container: U = [] as Node[] as U): U {
  const enum Types {
    Array,
    Node,
  }
  const obj = Array.isArray(container)
    ? { type: Types.Array as Types.Array, value: container as T, }
    : { type: Types.Node as Types.Node, value: container as Node, };
  void nodes
    .reduce<Node | undefined>((prev, curr) => {
      if (prev && prev.nodeType === 3 && curr.nodeType === 3) {
        prev.textContent += curr.textContent!;
        curr.textContent = '';
        return prev;
      }
      switch (obj.type) {
        case Types.Array:
          void obj.value.push(curr);
          break;
        case Types.Node:
          void obj.value.appendChild(curr);
          break;
      }
      return curr;
    }, undefined);
  return container;
}

export function hasContent(el: HTMLElement): boolean {
  return hasText(el)
      || !!el.querySelector('.media');
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
