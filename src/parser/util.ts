import { Parser, Ctx, fmap } from '../combinator';
import { syntax as comment } from './inline/comment';
import { DeepMutable } from 'spica/type';
import { define, apply } from 'typed-dom';

export function isVisible(node: HTMLElement): boolean {
  return hasText(node)
      || hasMedia(node);
}

function hasText(node: HTMLElement | Text): boolean {
  return node.textContent!.trim() !== '';
}

function hasMedia(node: HTMLElement): boolean {
  return node.getElementsByClassName('media').length > 0;
}

export function startTight<P extends Parser<unknown>>(parser: P): P;
export function startTight<T, D extends Parser<unknown, any>[]>(parser: Parser<T, D>): Parser<T, D> {
  return (source, context: DeepMutable<Ctx>) => {
    switch (true) {
      case source === '':
      case (source[0] === '\\' ? source[1] || '' : source[0]).trim() === '':
      case source.length >= 5
        && source[0] === '<'
        && source.slice(0, 5) === '<wbr>':
        return;
      case source.length >= 7
        && source[0] === '<'
        && source[1] === '#'
        && comment.test(source):
        context.resource && void --context.resource.backtrack;
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

export function suppress<T extends HTMLOListElement | DocumentFragment>(target: T): T {
  assert(!target.parentElement);
  assert(target instanceof DocumentFragment || target instanceof HTMLOListElement);
  if (target.nodeName === 'OL') {
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
