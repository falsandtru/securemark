import { Parser, List, Node } from '../combinator/data/parser';
import { Command } from './context';
import { Flag } from './node';
import { convert, fmap } from '../combinator';
import { invisibleBlankHTMLEntityNames, invisibleBlankCharacters } from './api/normalize';

namespace blank {
  export const line = new RegExp(
    /((?:^|\n)[^\S\r\n]*(?=\S))((?:[^\S\r\n]|\\(?=$|\s)|&IBHN;|[IBC]|<wbr ?>)+(?=$|\r?\n))/g.source
      .replace('IBHN', `(?:${invisibleBlankHTMLEntityNames.join('|')})`)
      .replace('IBC', `${invisibleBlankCharacters.join('')}`),
    'g');
  export const start = new RegExp(
    /(?:[^\S\r\n]|\\(?=$|\s)|&IBHN;|[IBC]|<wbr ?>)+/y.source
      .replace('IBHN', `(?:${invisibleBlankHTMLEntityNames.join('|')})`)
      .replace('IBC', `${invisibleBlankCharacters.join('')}`),
    'y');
  export const unit = new RegExp(
    /(?:[^\S\r\n]|\\(?=$|\s)|&IBHN;|[IBC]|<wbr ?>)/y.source
      .replace('IBHN', `(?:${invisibleBlankHTMLEntityNames.join('|')})`)
      .replace('IBC', `${invisibleBlankCharacters.join('')}`),
    'y');
}

export function visualize<P extends Parser>(parser: P): P {
  return convert(
    source => source.replace(blank.line, `$1${Command.Escape}$2`),
    parser);
}

export const beforeNonblank = beforeNonblankWith('');
export const afterNonblank = afterNonblankWith('');
export function blankWith(starts: '\n', delimiter: string | RegExp): RegExp {
  return new RegExp([
    // 空行除去
    // 完全な空行はエスケープ済みなので再帰的バックトラックにはならない。
    String.raw`(?:${starts}(?:\\?\s|&(?:${invisibleBlankHTMLEntityNames.join('|')});|[${invisibleBlankCharacters.join('')}]|<wbr ?>)*)?`,
    typeof delimiter === 'string'
      ? delimiter.replace(/[*+()\[\]]/g, '\\$&')
      : delimiter.source,
  ].join(''), 'y');
}
export function beforeNonblankWith(delimiter: string | RegExp): RegExp {
  return new RegExp([
    typeof delimiter === 'string'
      ? delimiter.replace(/[*+()\[\]]/g, '\\$&')
      : delimiter.source,
    String.raw`(?!\\?\s|&(?:${invisibleBlankHTMLEntityNames.join('|')});|[${invisibleBlankCharacters.join('')}]|<wbr ?>)`,
  ].join(''), 'y');
}
function afterNonblankWith(delimiter: string | RegExp): RegExp {
  return new RegExp([
    String.raw`(?<!\s|&(?:${invisibleBlankHTMLEntityNames.join('|')});|[${invisibleBlankCharacters.join('')}]|<wbr ?>)`,
    typeof delimiter === 'string'
      ? delimiter.replace(/[*+()\[\]]/g, '\\$&')
      : delimiter.source,
  ].join(''), 'y');
}

export function isNonblankFirstLine(nodes: List<Node<HTMLElement | string>>): boolean {
  if (nodes.length === 0) return true;
  for (const node of nodes) {
    if (isNonblank(node)) return true;
    if (node.flags & Flag.blank && typeof node.value === 'object' && node.value.tagName === 'BR') break;
  }
  return false;
}
export function isNonblankNodeStart(nodes: List<Node<HTMLElement | string>>): boolean {
  if (nodes.length === 0) return true;
  return isNonblank(nodes.head!, 0);
}
function isNonblank({ value: node, flags }: Node<HTMLElement | string>, strpos?: number): boolean {
  if (flags & Flag.blank) return false;
  if (typeof node !== 'string') return true;
  const str = node && strpos !== undefined
    ? node[strpos >= 0 ? strpos : node.length + strpos]
    : node;
  switch (str) {
    case '':
    case ' ':
    case '\t':
    case '\r':
    case '\n':
      return false;
    default:
      return str.trimStart() !== '';
  }
}

// 終端が必要な場合は無駄な後方トリムを避けるためtrimBlankStart+trimBlankNodeEndで処理する。
export function trimBlank<P extends Parser<HTMLElement | string>>(parser: P): P;
export function trimBlank<N extends HTMLElement | string>(parser: Parser<N>): Parser<N> {
  return trimBlankStart(trimBlankEnd(parser));
}
function trimBlankStart<P extends Parser>(parser: P): P;
function trimBlankStart<N>(parser: Parser<N>): Parser<N> {
  return input => {
    const context = input;
    const { source, position } = context;
    if (position === source.length) return;
    const reg = blank.start;
    reg.lastIndex = position;
    reg.test(source);
    context.position = reg.lastIndex || position;
    return context.position === source.length
      ? new List()
      : parser(input);
  };
}
export function trimBlankEnd<P extends Parser<HTMLElement | string>>(parser: P): P;
export function trimBlankEnd<N extends HTMLElement>(parser: Parser<N>): Parser<string | N> {
  return fmap(parser, trimBlankNodeEnd);
}
export function trimBlankNodeEnd<N extends HTMLElement>(nodes: List<Node<string | N>>): List<Node<string | N>> {
  const skip = nodes.last && ~nodes.last.flags & Flag.blank && typeof nodes.last.value === 'object'
    ? nodes.last.value.className === 'indexer'
    : false;
  for (let node = skip ? nodes.last?.prev : nodes.last; node;) {
    if (~node.flags & Flag.blank) {
      if (typeof node.value === 'string') {
        const str = node.value.trimEnd();
        if (str.length > 0) {
          node.value = str;
          break;
        }
      }
      else {
        break;
      }
    }
    const target = node;
    node = node.prev;
    nodes.delete(target);
  }
  return nodes;
}
