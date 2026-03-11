import { Parser, Input, List, Node, failsafe } from '../combinator/data/parser';
import { Context, Command } from './context';
import { Flag } from './node';
import { convert, fmap } from '../combinator';
import { invisibleHTMLEntityNames } from './api/normalize';

namespace blank {
  export const line = new RegExp(
    /((?:^|\n)[^\S\n]*(?=\S))((?:[^\S\n]|\\(?=$|\s)|&IHN;|<wbr ?>)+(?=$|\n))/g.source
      .replace('IHN', `(?:${invisibleHTMLEntityNames.join('|')})`),
    'g');
  export const start = new RegExp(
    /(?:[^\S\n]|\\(?=$|\s)|&IHN;|<wbr ?>)+/y.source
      .replace('IHN', `(?:${invisibleHTMLEntityNames.join('|')})`),
    'y');
  export const unit = new RegExp(
    /(?:[^\S\n]|\\(?=$|\s)|&IHN;|<wbr ?>)/y.source
      .replace('IHN', `(?:${invisibleHTMLEntityNames.join('|')})`),
    'y');
}

export function visualize<P extends Parser>(parser: P): P {
  return convert(
    source => source.replace(blank.line, `$1${Command.Escape}$2`),
    parser);
}

export const afterNonblank = nonblankWith('');
export function blankWith(starts: '\n', delimiter: string | RegExp): RegExp {
  return new RegExp([
    // 空行除去
    // 完全な空行はエスケープ済みなので再帰的バックトラックにはならない。
    String.raw`(?:${starts}(?:\\?\s|&(?:${invisibleHTMLEntityNames.join('|')});|<wbr ?>)*)?`,
    typeof delimiter === 'string'
      ? delimiter.replace(/[*+()\[\]]/g, '\\$&')
      : delimiter.source,
  ].join(''), 'y');
}
function nonblankWith(delimiter: string | RegExp): RegExp {
  return new RegExp([
    String.raw`(?<!\s|&(?:${invisibleHTMLEntityNames.join('|')});|<wbr ?>)`,
    typeof delimiter === 'string'
      ? delimiter.replace(/[*+()\[\]]/g, '\\$&')
      : delimiter.source,
  ].join(''), 'y');
}

//export function looseStart<P extends Parser<HTMLElement | string>>(parser: P): P;
//export function looseStart<N extends HTMLElement | string>(parser: Parser<N>): Parser<N> {
//  return input =>
//    isLooseStart(input)
//      ? parser(input)
//      : undefined;
//}
//const isLooseStart = reduce(({ source, context }: Input<Context>): boolean => {
//  return isTightStart({ source: source.replace(blank.start, ''), context });
//}, ({ source }) => `${source}${Command.Separator}`);

export function beforeNonblank<P extends Parser>(parser: P): P;
export function beforeNonblank<N>(parser: Parser<N>): Parser<N, Context> {
  return input =>
    isTightStart(input)
      ? parser(input)
      : undefined;
}
function isTightStart(input: Input<Context>): boolean {
  const { context } = input;
  const { source, position } = context;
  if (position === source.length) return true;
  switch (source[position]) {
    case ' ':
    case '　':
    case '\t':
    case '\n':
      return false;
    default:
      const reg = blank.unit;
      reg.lastIndex = position;
      return !reg.test(source);
  }
}

export function isLooseNodeStart(nodes: List<Node<HTMLElement | string>>): boolean {
  if (nodes.length === 0) return true;
  for (const node of nodes) {
    if (isVisible(node)) return true;
    if (typeof node.value === 'object' && node.value.tagName === 'BR') break;
  }
  return false;
}
export function isTightNodeStart(nodes: List<Node<HTMLElement | string>>): boolean {
  if (nodes.length === 0) return true;
  return isVisible(nodes.head!, 0);
}
//export function isTightNodeEnd(nodes: readonly (HTMLElement | string)[]): boolean {
//  if (nodes.length === 0) return true;
//  return isVisible(nodes.at(-1)!, -1);
//}
function isVisible({ value: node, flags }: Node<HTMLElement | string>, strpos?: 0 | -1): boolean {
  if (strpos === undefined || typeof node !== 'string') return !(flags & Flag.invisible);
  const char = node && node[strpos && node.length + strpos];
  switch (char) {
    case '':
    case ' ':
    case '\t':
    case '\n':
      return false;
    default:
      return char.trimStart() !== '';
  }
}

// 終端が必要な場合は無駄な後方トリムを避けるためtrimBlankStart+trimBlankNodeEndで処理する。
export function trimBlank<P extends Parser<HTMLElement | string>>(parser: P): P;
export function trimBlank<N extends HTMLElement | string>(parser: Parser<N>): Parser<N> {
  return trimBlankStart(trimBlankEnd(parser));
}
function trimBlankStart<P extends Parser>(parser: P): P;
function trimBlankStart<N>(parser: Parser<N>): Parser<N> {
  return failsafe(input => {
    const { context } = input;
    const { source, position } = context;
    if (position === source.length) return;
    const reg = blank.start;
    reg.lastIndex = position;
    reg.test(source);
    context.position = reg.lastIndex || position;
    return context.position === source.length
      ? new List()
      : parser(input);
  });
}
export function trimBlankEnd<P extends Parser<HTMLElement | string>>(parser: P): P;
export function trimBlankEnd<N extends HTMLElement>(parser: Parser<N>): Parser<string | N> {
  return fmap(parser, trimBlankNodeEnd);
}
//export function trimBlankNode<N extends HTMLElement | string>(nodes: N[]): N[] {
//  return trimBlankNodeStart(trimBlankNodeEnd(nodes));
//}
//function trimBlankNodeStart<N extends HTMLElement | string>(nodes: N[]): N[] {
//  for (let node = nodes[0]; nodes.length > 0 && !isVisible(node = nodes[0], 0);) {
//    if (typeof node === 'string') {
//      const pos = node.trimStart().length;
//      if (pos > 0) {
//        nodes[0] = node.slice(-pos) as N;
//        break;
//      }
//    }
//    else if (nodes.length === 1 && node.className === 'indexer') {
//      break;
//    }
//    nodes.shift();
//  }
//  return nodes;
//}
export function trimBlankNodeEnd<N extends HTMLElement>(nodes: List<Node<string | N>>): List<Node<string | N>> {
  const skip = typeof nodes.last?.value === 'object' && nodes.last.value.className === 'indexer';
  for (let node = skip ? nodes.last?.prev : nodes.last; node && !isVisible(node, -1);) {
    if (typeof node.value === 'string') {
      const str = node.value.trimEnd();
      if (str.length > 0) {
        node.value = str;
        break;
      }
    }
    const target = node;
    node = node.prev;
    nodes.delete(target);
  }
  return nodes;
}
