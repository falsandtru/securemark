import { Parser, fmap } from '../combinator';
import { htmlentity, comment } from './inline';
import { define, apply } from 'typed-dom';
import { pop } from 'spica/array';

export function isTight(nodes: (HTMLElement | Text)[], start: number, end: number): boolean {
  if (end < 0) return isTight(nodes, start, nodes.length + end);
  if (start >= nodes.length) return true;
  switch (false) {
    case start < nodes.length:
    case end <= nodes.length:
    case isVisible(nodes[start], 'start'):
      return false;
    case end > start:
      return true;
  }
  --end;
  const data = 'data' in nodes[end]
    ? (nodes[end] as Text).data
    : '';
  return data.length > 1
    ? isVisible(nodes[end], 'end', 0) ||
      isVisible(nodes[end], 'end', 1)
    : isVisible(nodes[end], 'end') ||
      isVisible(nodes[end - 1], 'end');
}
function isVisible(node: HTMLElement | Text | undefined, dir: 'start' | 'end', offset = 0): boolean {
  assert(offset >= 0);
  if (!node) return false;
  if ('data' in node) {
    const data = node.data;
    const char = data[dir === 'start' ? 0 + offset : data.length - 1 - offset];
    assert(char);
    switch (char) {
      case '':
      case ' ':
      case '\t':
      case '\n':
        return false;
      default:
        return char.trim() !== '';
    }
  }
  else {
    switch (node.tagName) {
      case 'BR':
      case 'WBR':
        return false;
      case 'SPAN':
        return node.className !== 'linebreak';
      case 'SUP':
        return node.className !== 'comment';
      default:
        return true;
    }
  }
}

export function startTight<P extends Parser<unknown>>(parser: P): P;
export function startTight<T, D extends Parser<unknown, any>[]>(parser: Parser<T, D>): Parser<T, D> {
  return (source, context) => {
    if (source === '') return;
    switch (source[0]) {
      case ' ':
      case '　':
      case '\t':
      case '\n':
        return;
      case '&':
        switch (true) {
          case source.length > 2
            && source[1] !== ' '
            && !!htmlentity(source, context):
            return;
        }
        break;
      case '<':
        switch (true) {
          case source.length >= 7
            && source[1] === '#'
            && !!comment(source, context):
          case source.length >= 5
            && source[1] === 'w'
            && source.slice(0, 5) === '<wbr>':
          case source.length >= 4
            && source[1] === 'b'
            && source.slice(0, 4) === '<br>':
            return;
        }
        break;
    }
    return (source[0] === '\\' ? source[1] : source[0])?.trim()
      ? parser(source, context)
      : void 0;
  }
}

export function trimEnd<T extends HTMLElement | Text>(nodes: T[]): T[];
export function trimEnd(nodes: (HTMLElement | Text)[]): (HTMLElement | Text)[] {
  if (nodes.length === 0) return nodes;
  const node = nodes[nodes.length - 1];
  return 'id' in node && node.tagName === 'BR'
    ? pop(nodes)[0]
    : nodes;
}

export function dup<T, D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T, D, C>): Parser<T[], D, C> {
  return fmap(parser, ns => [ns]);
}

export function defrag<T extends Node>(node: T): T {
  return void node.normalize(), node;
}

export function stringify(nodes: (HTMLElement | Text)[]): string {
  return nodes.reduce((acc, node) =>
    `${acc}${'data' in node ? node.data : node.textContent}`
  , '');
}

export function suppress<T extends HTMLOListElement | DocumentFragment>(target: T): T;
export function suppress(target: HTMLOListElement | DocumentFragment): HTMLOListElement | DocumentFragment {
  assert(!target.parentElement);
  assert(target instanceof DocumentFragment || target instanceof HTMLOListElement);
  if ('id' in target && target.tagName === 'OL') {
    assert.deepStrictEqual([...target.querySelectorAll('.footnote')], [...target.querySelectorAll(':scope > li')]);
    assert.deepStrictEqual([...target.querySelectorAll('.footnote > sup:last-child > a')], [...target.querySelectorAll(':scope > .footnote[id] > sup:last-child > a[href]')]);
    void apply(target, '.footnote > sup:last-child > a', { href: null });
  }
  for (let i = 0, { children } = target, len = children.length; i < len; ++i) {
    const child = children[i];
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
