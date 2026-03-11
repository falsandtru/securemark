import { Parser, Input, List, Node, failsafe } from '../combinator/data/parser';
import { Context, Command } from './context';
import { convert, fmap } from '../combinator';
import { unsafehtmlentity } from './inline/htmlentity';
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
}

export function visualize<P extends Parser<HTMLElement | string>>(parser: P): P;
export function visualize<N extends HTMLElement | string>(parser: Parser<N>): Parser<N> {
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
    case '\\':
      return source[position + 1]?.trimStart() !== '';
    case '&':
      switch (true) {
        case source.length - position > 2
          && source[position + 1] !== ' '
          && unsafehtmlentity(input)?.head?.value.trimStart() === '':
          context.position = position;
          return false;
      }
      context.position = position;
      return true;
    case '<':
      switch (true) {
        case source.length - position >= 5
          && source.startsWith('<wbr', position)
          && (source[position + 4] === '>' || source.startsWith(' >', position + 4)):
          return false;
      }
      return true;
    default:
      return source[position].trimStart() !== '';
  }
}

export function isLooseNodeStart(nodes: List<Node<HTMLElement | string>>): boolean {
  if (nodes.length === 0) return true;
  for (const { value: node } of nodes) {
    if (isVisible(node)) return true;
    if (typeof node === 'object' && node.tagName === 'BR') break;
  }
  return false;
}
export function isTightNodeStart(nodes: List<Node<HTMLElement | string>>): boolean {
  if (nodes.length === 0) return true;
  return isVisible(nodes.head!.value, 0);
}
//export function isTightNodeEnd(nodes: readonly (HTMLElement | string)[]): boolean {
//  if (nodes.length === 0) return true;
//  return isVisible(nodes.at(-1)!, -1);
//}
function isVisible(node: HTMLElement | string, strpos?: number): boolean {
  switch (typeof node) {
    case 'string':
      const char = node && strpos !== undefined
        ? node[strpos >= 0 ? strpos : node.length + strpos]
        : node;
      switch (char) {
        case '':
        case ' ':
        case '\t':
        case '\n':
          return false;
        default:
          return char.trimStart() !== '';
      }
    default:
      switch (node.tagName) {
        case 'BR':
        case 'WBR':
          return false;
        default:
          return true;
      }
  }
}

// デフラグ前の非効率な後方トリムを避けるため必要のない限りtrimBlankStart+trimNodeEndで処理する。
export function trimBlank<P extends Parser<HTMLElement | string>>(parser: P): P;
export function trimBlank<N extends HTMLElement | string>(parser: Parser<N>): Parser<N> {
  return trimBlankStart(trimBlankEnd(parser));
}
export function trimBlankStart<P extends Parser>(parser: P): P;
export function trimBlankStart<N>(parser: Parser<N>): Parser<N> {
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
  const skip = nodes.length > 0 &&
    typeof nodes.last?.value === 'object' &&
    nodes.last.value.className === 'indexer'
    ? nodes.pop()
    : undefined;
  for (let node = nodes.last; nodes.length > 0 && !isVisible((node = nodes.last!).value, -1);) {
    if (typeof node.value === 'string') {
      const str = node.value.trimEnd();
      if (str.length > 0) {
        node.value = str;
        break;
      }
    }
    nodes.pop();
  }
  skip && nodes.push(skip);
  return nodes;
}
