import { MarkdownParser } from '../../markdown';
import { Command } from './context';
import { Parser, Input, eval, failsafe } from '../combinator/data/parser';
import { union, some, verify, convert, fmap } from '../combinator';
import { unsafehtmlentity } from './inline/htmlentity';
import { linebreak, unescsource } from './source';
import { invisibleHTMLEntityNames } from './api/normalize';
import { push } from 'spica/array';

export namespace blank {
  export const line = new RegExp(
    /^(?:\\?[^\S\r\n]|&IHN;|<wbr[^\S\n]*>|\\$)+$/.source
      .replace('IHN', `(?:${invisibleHTMLEntityNames.join('|')})`),
    'gm');
  export const start = new RegExp(
    /(?:\\?[^\S\r\n]|&IHN;|<wbr[^\S\n]*>)+/y.source
      .replace('IHN', `(?:${invisibleHTMLEntityNames.join('|')})`), 'y');
}

export function visualize<P extends Parser<HTMLElement | string>>(parser: P): P;
export function visualize<N extends HTMLElement | string>(parser: Parser<N>): Parser<N> {
  return union([
    convert(
      source => source.replace(blank.line, line => line.replace(/[\\&<]/g, `${Command.Escape}$&`)),
      verify(parser, (ns, { source, position }) => position === source.length && hasVisible(ns)),
      false),
    some(union([linebreak, unescsource])),
  ]);
}
function hasVisible(
  nodes: readonly (HTMLElement | string)[],
): boolean {
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    if (typeof node === 'string') {
      if (node && node.trimStart()) return true;
    }
    else {
      if (node.innerText.trimStart()) return true;
      if (node.classList.contains('reference')) return true;
      //if (state & State.media ^ State.media &&
      //    (node.classList.contains('media') || node.getElementsByClassName('media')[0])) return true;
    }
  }
  return false;
}

export function blankWith(delimiter: string | RegExp): RegExp;
export function blankWith(starts: '' | '\n', delimiter: string | RegExp): RegExp;
export function blankWith(starts: '' | '\n', delimiter?: string | RegExp): RegExp {
  if (delimiter === undefined) return blankWith('', starts);
  return new RegExp(String.raw
    `(?:(?=${starts})(?:\\?\s|&(?:${invisibleHTMLEntityNames.join('|')});|<wbr[^\S\n]*>)${
      // 空行除去
      // 完全な空行はエスケープ済みなので再帰的バックトラックにはならない。
      starts && '+'
    })?${
      typeof delimiter === 'string'
        ? delimiter.replace(/[*+()\[\]]/g, '\\$&')
        : delimiter.source
    }`, 'y');
}

//export function looseStart<P extends Parser<HTMLElement | string>>(parser: P, except?: string): P;
//export function looseStart<N extends HTMLElement | string>(parser: Parser<N>, except?: string): Parser<N> {
//  return input =>
//    isLooseStart(input, except)
//      ? parser(input)
//      : undefined;
//}
//const isLooseStart = reduce(({ source, context }: Input<MarkdownParser.Context>, except?: string): boolean => {
//  return isTightStart({ source: source.replace(blank.start, ''), context }, except);
//}, ({ source }, except = '') => `${source}${Command.Separator}${except}`);

export function tightStart<P extends Parser<unknown>>(parser: P, except?: string): P;
export function tightStart<N>(parser: Parser<N>, except?: string): Parser<N> {
  return input =>
    isTightStart(input, except)
      ? parser(input)
      : undefined;
}
function isTightStart(input: Input<MarkdownParser.Context>, except?: string): boolean {
  const { context } = input;
  const { source, position } = context;
  if (position === source.length) return true;
  if (except && source.startsWith(except, position)) return false;
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
          && eval(unsafehtmlentity(input))?.[0]?.trimStart() === '':
          context.position = position;
          return false;
      }
      context.position = position;
      return true;
    case '<':
      switch (true) {
        case source.length - position >= 5
          && source.startsWith('<wbr', position)
          && (source[position + 5] === '>' || /^<wbr[^\S\n]*>/.test(source.slice(position))):
          return false;
      }
      return true;
    default:
      return source[position].trimStart() !== '';
  }
}

export function isLooseNodeStart(nodes: readonly (HTMLElement | string)[]): boolean {
  if (nodes.length === 0) return true;
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    if (isVisible(node)) return true;
    if (typeof node === 'object' && node.tagName === 'BR') break;
  }
  return false;
}
export function isTightNodeStart(nodes: readonly (HTMLElement | string)[]): boolean {
  if (nodes.length === 0) return true;
  return isVisible(nodes[0], 0);
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
export function trimBlankStart<P extends Parser<unknown>>(parser: P): P;
export function trimBlankStart<N>(parser: Parser<N>): Parser<N> {
  return failsafe(input => {
    const { context } = input;
    const { source, position } = context;
    const reg = blank.start;
    reg.lastIndex = position;
    reg.test(source);
    context.position = reg.lastIndex || position;
    return parser(input);
  });
}
export function trimBlankEnd<P extends Parser<HTMLElement | string>>(parser: P): P;
export function trimBlankEnd<N extends HTMLElement | string>(parser: Parser<N>): Parser<N> {
  return fmap(
    parser,
    trimBlankNodeEnd);
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
export function trimBlankNodeEnd<N extends HTMLElement | string>(nodes: N[]): N[] {
  const skip = nodes.length > 0 &&
    typeof nodes.at(-1) === 'object' &&
    nodes.at(-1)!['className'] === 'indexer'
    ? [nodes.pop()!]
    : [];
  for (let node = nodes[0]; nodes.length > 0 && !isVisible(node = nodes.at(-1)!, -1);) {
    if (typeof node === 'string') {
      const str = node.trimEnd();
      if (str.length > 0) {
        nodes[nodes.length - 1] = str as N;
        break;
      }
    }
    nodes.pop();
  }
  return push(nodes, skip);
}
