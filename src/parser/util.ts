import { Parser, Ctx, fmap } from '../combinator';
import { syntax as comment } from './inline/comment';
import { DeepMutable } from 'spica/type';
import { define, apply } from 'typed-dom';

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
  return (source, context: DeepMutable<Ctx>) => {
    if (source === '') return;
    switch (true) {
      case source[0] === '<':
        switch (true) {
          case source.length >= 7
            && source[0] === '<'
            && source[1] === '#'
            && comment.test(source):
            context.resource && void --context.resource.backtrack;
            return;
          case source.length >= 5
            && source[1] === 'w'
            && source.slice(0, 5) === '<wbr>':
          case source.length >= 4
            && source[1] === 'b'
            && source.slice(0, 4) === '<br>':
            return;
          default:
            return parser(source, context);
        }
      case source[0] === ' ':
      case source[0] === '\n':
      case (source[0] === '\\' ? source[1] || '' : source[0]).trim() === '':
        return;
      default:
        return parser(source, context);
    }
  }
}

export function dup<T, D extends Parser<unknown, any, C>[], C extends object>(parser: Parser<T, D, C>): Parser<T[], D, C> {
  return fmap(parser, ns => [ns]);
}

export function defrag<T extends Node>(node: T): T {
  return void node.normalize(), node;
}

export function stringify(nodes: (Node | Text)[]): string {
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
