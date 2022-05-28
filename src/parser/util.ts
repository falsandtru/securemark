import { undefined } from 'spica/global';
import { MarkdownParser } from '../../markdown';
import { Parser, eval } from '../combinator/data/parser';
import { union, some, verify, convert, fmap } from '../combinator';
import { unsafehtmlentity } from './inline/htmlentity';
import { linebreak, unescsource } from './source';
import { invisibleHTMLEntityNames } from './api/normalize';
import { reduce } from 'spica/memoize';
import { push } from 'spica/array';

export const regBlankInlineStart = new RegExp(String.raw
  `^(?:\\?[^\S\n]|&(?:${invisibleHTMLEntityNames.join('|')});|<wbr>)+`);

export function blank(prefix: '' | RegExp, suffix: string | RegExp): RegExp {
  return new RegExp(String.raw
    `^(?:${
      prefix && prefix.source
    }(?:\\?\s|&(?:${invisibleHTMLEntityNames.join('|')});|<wbr>)*)?${
      typeof suffix === 'string' ? suffix.replace(/[*+()\[\]]/g, '\\$&') : suffix.source
    }`);
}

export function visualize<P extends Parser<HTMLElement | string>>(parser: P): P;
export function visualize<T extends HTMLElement | string>(parser: Parser<T>): Parser<T> {
  const blankline = new RegExp(String.raw
    `^(?:\\$|\\?[^\S\n]|&(?:${invisibleHTMLEntityNames.join('|')});|<wbr>)+$`,
    'gm');
  return union([
    convert(
      source => source.replace(blankline, line => line.replace(/[\\&<]/g, '\x1B$&')),
      verify(parser, (ns, rest, context) => !rest && hasVisible(ns, context))),
    some(union([linebreak, unescsource])),
  ]);
}
function hasVisible(
  nodes: readonly (HTMLElement | string)[],
  { syntax: { inline: { media = true } = {} } = {} }: MarkdownParser.Context = {},
): boolean {
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    if (typeof node === 'string') {
      if (node && node.trimStart()) return true;
    }
    else {
      if (node.innerText.trimStart()) return true;
      if (media && (node.classList.contains('media') || node.getElementsByClassName('media')[0])) return true;
    }
  }
  return false;
}

export function startLoose<P extends Parser<HTMLElement | string>>(parser: P, except?: string): P;
export function startLoose<T extends HTMLElement | string>(parser: Parser<T>, except?: string): Parser<T> {
  return (source, context) =>
    isStartLoose(source, context, except)
      ? parser(source, context)
      : undefined;
}
export const isStartLoose = reduce((source: string, context: MarkdownParser.Context, except?: string): boolean => {
  return isStartTight(source.replace(regBlankInlineStart, ''), context, except);
}, (source, _, except = '') => `${source}\x1E${except}`);
export function startTight<P extends Parser<unknown>>(parser: P, except?: string): P;
export function startTight<T>(parser: Parser<T>, except?: string): Parser<T> {
  return (source, context) =>
    isStartTight(source, context, except)
      ? parser(source, context)
      : undefined;
}
const isStartTight = reduce((source: string, context: MarkdownParser.Context, except?: string): boolean => {
  if (source === '') return true;
  if (except && source.slice(0, except.length) === except) return false;
  switch (source[0]) {
    case ' ':
    case '　':
    case '\t':
    case '\n':
      return false;
    case '\\':
      return source[1]?.trimStart() !== '';
    case '&':
      switch (true) {
        case source.length > 2
          && source[1] !== ' '
          && eval(unsafehtmlentity(source, context))?.[0]?.trimStart() === '':
          return false;
      }
      return true;
    case '<':
      switch (true) {
        case source.length >= 5
          && source[1] === 'w'
          && source.slice(0, 5) === '<wbr>':
          return false;
      }
      return true;
    default:
      return source[0].trimStart() !== '';
  }
}, (source, _, except = '') => `${source}\x1E${except}`);
export function isStartTightNodes(nodes: readonly (HTMLElement | string)[]): boolean {
  if (nodes.length === 0) return true;
  return isVisible(nodes[0], 0);
}
//export function isEndTightNodes(nodes: readonly (HTMLElement | string)[]): boolean {
//  if (nodes.length === 0) return true;
//  return isVisible(nodes[nodes.length - 1], -1);
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
        case 'SPAN':
          return node.className !== 'linebreak';
        default:
          return true;
      }
  }
}

export function trimBlankInline<P extends Parser<HTMLElement | string>>(parser: P): P;
export function trimBlankInline<T extends HTMLElement | string>(parser: Parser<T>): Parser<T> {
  return fmap(
    trimBlankInlineStart(parser),
    trimNodeEnd);
}
function trimBlankInlineStart<P extends Parser<unknown>>(parser: P): P;
function trimBlankInlineStart<T>(parser: Parser<T>): Parser<T> {
  return convert(
    reduce(source => source.replace(regBlankInlineStart, '')),
    parser);
}
//export function trimNode(nodes: (HTMLElement | string)[]): (HTMLElement | string)[] {
//  return trimNodeStart(trimNodeEnd(nodes));
//}
//function trimNodeStart(nodes: (HTMLElement | string)[]): (HTMLElement | string)[] {
//  for (let node = nodes[0]; nodes.length > 0 && !isVisible(node = nodes[0], 0);) {
//    if (nodes.length === 1 && typeof node === 'object' && node.className === 'indexer') break;
//    if (typeof node === 'string') {
//      const pos = node.length - node.trimStart().length;
//      if (pos > 0) {
//        nodes[0] = node.slice(pos);
//        break;
//      }
//    }
//    nodes.shift();
//  }
//  return nodes;
//}
export function trimNodeEnd<T extends HTMLElement | string>(nodes: T[]): T[] {
  const skip = nodes.length > 0 &&
    typeof nodes[nodes.length - 1] === 'object' &&
    nodes[nodes.length - 1]['className'] === 'indexer'
    ? [nodes.pop()!]
    : [];
  for (let node = nodes[0]; nodes.length > 0 && !isVisible(node = nodes[nodes.length - 1], -1);) {
    if (typeof node === 'string') {
      const pos = node.trimEnd().length;
      if (pos > 0) {
        nodes[nodes.length - 1] = node.slice(0, pos) as T;
        break;
      }
    }
    nodes.pop();
  }
  return push(nodes, skip);
}

export function stringify(nodes: readonly (HTMLElement | string)[]): string {
  let acc = '';
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    if (typeof node === 'string') {
      assert(!node.includes('\n'));
      acc += node;
    }
    else {
      assert(!node.matches('br') && !node.querySelector('br'));
      // NOTE: Doesn't reflect line breaks.
      acc += node.innerText;
    }
  }
  return acc;
}
