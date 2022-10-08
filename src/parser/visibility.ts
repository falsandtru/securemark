import { MarkdownParser } from '../../markdown';
import { Parser, Input, eval } from '../combinator/data/parser';
import { union, some, verify, convert, fmap } from '../combinator';
import { unsafehtmlentity } from './inline/htmlentity';
import { linebreak, unescsource } from './source';
import { State } from './context';
import { invisibleHTMLEntityNames } from './api/normalize';
import { reduce } from 'spica/memoize';
import { push } from 'spica/array';

export function visualize<P extends Parser<HTMLElement | string>>(parser: P): P;
export function visualize<T extends HTMLElement | string>(parser: Parser<T>): Parser<T> {
  const blankline = new RegExp(
    /^(?:\\$|\\?[^\S\n]|&IHN;|<wbr[^\S\n]*>)+$/.source.replace('IHN', `(?:${invisibleHTMLEntityNames.join('|')})`),
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
  { state = 0 }: MarkdownParser.Context = {},
): boolean {
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    if (typeof node === 'string') {
      if (node && node.trimStart()) return true;
    }
    else {
      if (node.innerText.trimStart()) return true;
      if (state & State.media ^ State.media &&
          (node.classList.contains('media') || node.getElementsByClassName('media')[0])) return true;
    }
  }
  return false;
}

export const regBlankStart = new RegExp(
  /^(?:\\?[^\S\n]|&IHN;|<wbr[^\S\n]*>)+/.source.replace('IHN', `(?:${invisibleHTMLEntityNames.join('|')})`));

export function blankWith(delimiter: string | RegExp): RegExp;
export function blankWith(starting: '' | '\n', delimiter: string | RegExp): RegExp;
export function blankWith(starting: '' | '\n', delimiter?: string | RegExp): RegExp {
  if (delimiter === undefined) return blankWith('', starting);
  return new RegExp(String.raw
    `^(?:(?=${
      starting
    })(?:\\?\s|&(?:${invisibleHTMLEntityNames.join('|')});|<wbr[^\S\n]*>)${starting && '+'})?${
      typeof delimiter === 'string' ? delimiter.replace(/[*+()\[\]]/g, '\\$&') : delimiter.source
    }`);
}

export function startLoose<P extends Parser<HTMLElement | string>>(parser: P, except?: string): P;
export function startLoose<T extends HTMLElement | string>(parser: Parser<T>, except?: string): Parser<T> {
  return input =>
    isStartLoose(input, except)
      ? parser(input)
      : undefined;
}
const isStartLoose = reduce(({ source, context }: Input<MarkdownParser.Context>, except?: string): boolean => {
  return isStartTight({ source: source.replace(regBlankStart, ''), context }, except);
}, ({ source }, except = '') => `${source}\x1E${except}`);

export function startTight<P extends Parser<unknown>>(parser: P, except?: string): P;
export function startTight<T>(parser: Parser<T>, except?: string): Parser<T> {
  return input =>
    isStartTight(input, except)
      ? parser(input)
      : undefined;
}
const isStartTight = reduce(({ source, context }: Input<MarkdownParser.Context>, except?: string): boolean => {
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
          && eval(unsafehtmlentity({ source, context }))?.[0]?.trimStart() === '':
          return false;
      }
      return true;
    case '<':
      switch (true) {
        case source.length >= 5
          && source.slice(0, 4) === '<wbr'
          && (source[5] === '>' || /^<wbr[^\S\n]*>/.test(source)):
          return false;
      }
      return true;
    default:
      return source[0].trimStart() !== '';
  }
}, ({ source }, except = '') => `${source}\x1E${except}`);

export function isStartLooseNodes(nodes: readonly (HTMLElement | string)[]): boolean {
  if (nodes.length === 0) return true;
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    if (isVisible(node)) return true;
    if (typeof node === 'object') {
      if (node.tagName === 'BR') break;
      if (node.className === 'linebreak') break;
    }
  }
  return false;
}
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

export function trimBlank<P extends Parser<HTMLElement | string>>(parser: P): P;
export function trimBlank<T extends HTMLElement | string>(parser: Parser<T>): Parser<T> {
  return trimBlankStart(trimBlankEnd(parser));
}
export function trimBlankStart<P extends Parser<unknown>>(parser: P): P;
export function trimBlankStart<T>(parser: Parser<T>): Parser<T> {
  return convert(
    reduce(source => source.replace(regBlankStart, '')),
    parser);
}
export function trimBlankEnd<P extends Parser<HTMLElement | string>>(parser: P): P;
export function trimBlankEnd<T extends HTMLElement | string>(parser: Parser<T>): Parser<T> {
  return fmap(
    parser,
    trimNodeEnd);
}
export function trimNode<T extends HTMLElement | string>(nodes: T[]): T[] {
  return trimNodeStart(trimNodeEnd(nodes));
}
function trimNodeStart<T extends HTMLElement | string>(nodes: T[]): T[] {
  for (let node = nodes[0]; nodes.length > 0 && !isVisible(node = nodes[0], 0);) {
    if (nodes.length === 1 && typeof node === 'object' && node.className === 'indexer') break;
    if (typeof node === 'string') {
      const pos = node.trimStart().length;
      if (pos > 0) {
        nodes[0] = node.slice(-pos) as T;
        break;
      }
    }
    nodes.shift();
  }
  return nodes;
}
function trimNodeEnd<T extends HTMLElement | string>(nodes: T[]): T[] {
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
