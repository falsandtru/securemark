import { undefined } from 'spica/global';
import { MarkdownParser } from '../../markdown';
import { Parser, eval } from '../combinator/data/parser';
import { union, some, verify, clear, convert, trim } from '../combinator';
import { comment } from './inline/comment';
import { htmlentity } from './inline/htmlentity';
import { linebreak, unescsource, str } from './source';
import { push, pop } from 'spica/array';

// https://dev.w3.org/html5/html-author/charref
const invisibleHTMLEntityNames = [
  'Tab',
  'NewLine',
  'NonBreakingSpace',
  'nbsp',
  'shy',
  'ensp',
  'emsp',
  'emsp13',
  'emsp14',
  'numsp',
  'puncsp',
  'ThinSpace',
  'thinsp',
  'VeryThinSpace',
  'hairsp',
  'ZeroWidthSpace',
  'NegativeVeryThinSpace',
  'NegativeThinSpace',
  'NegativeMediumSpace',
  'NegativeThickSpace',
  'zwj',
  'zwnj',
  'lrm',
  'rlm',
  'MediumSpace',
  'NoBreak',
  'ApplyFunction',
  'af',
  'InvisibleTimes',
  'it',
  'InvisibleComma',
  'ic',
];
const blankline = new RegExp(String.raw`^(?!$|\n)(?:\\?\s|&(?:${invisibleHTMLEntityNames.join('|')});|<wbr>|\[(#+)\s+(?!\s|\1\])\S[^\n]*?(?:\n.*?){0,99}?(?:\s|\n\s*)\1\])*\\?(?:$|\n)`, 'gm');

export function visualize<P extends Parser<HTMLElement | string>>(parser: P): P;
export function visualize<T extends HTMLElement | string>(parser: Parser<T>): Parser<T> {
  return convert(
    source => source.replace(blankline, line => line.replace(/[\\&<\[]/g, '\x7F\\$&')),
    union([
      verify(parser, (ns, rest, context) => !rest && hasVisible(ns, context)),
      trim(some(union([clear(str('\x7F\\')), linebreak, unescsource]))),
    ]));
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
export function isStartLoose(source: string, context: MarkdownParser.Context, except?: string): boolean {
  source &&= source.replace(/^[^\S\n]+/, '');
  if (source === '') return true;
  return source.slice(0, except?.length ?? 0) !== except
      && isStartTight(source, context);
}
export function startTight<P extends Parser<unknown>>(parser: P): P;
export function startTight<T>(parser: Parser<T>): Parser<T> {
  return (source, context) =>
    isStartTight(source, context)
      ? parser(source, context)
      : undefined;
}
function isStartTight(source: string, context: MarkdownParser.Context): boolean {
  if (source === '') return true;
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
          && eval(htmlentity(source, context))?.[0].trimStart() === '':
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
    case '[':
      switch (true) {
        case source.length >= 7
          && source[1] === '#'
          && eval(comment(source, context))?.[0].className === 'comment':
          assert(!eval(comment(source, context))?.[0].matches('.invalid'));
          return false;
      }
      return true;
    default:
      return source[0].trimStart() !== '';
  }
}
export function isStartTightNodes(nodes: readonly (HTMLElement | string)[]): boolean {
  if (nodes.length === 0) return true;
  return isVisible(nodes[0], 0);
}
export function isEndTightNodes(nodes: readonly (HTMLElement | string)[]): boolean {
  if (nodes.length === 0) return true;
  return isVisible(nodes[nodes.length - 1], -1);
}
function isVisible(node: HTMLElement | string, position?: number): boolean {
  if (!node) return false;
  switch (typeof node) {
    case 'string':
      const char = position === undefined
        ? node
        : node[position >= 0 ? position : node.length + position];
      assert(char);
      switch (char) {
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
        case 'SUP':
          return node.className !== 'comment';
        default:
          return true;
      }
  }
}

export function trimNode(nodes: (HTMLElement | string)[]): (HTMLElement | string)[] {
  return trimNodeStart(trimNodeEnd(nodes));
}
function trimNodeStart(nodes: (HTMLElement | string)[]): (HTMLElement | string)[] {
  const skip = nodes.length > 0 &&
    typeof nodes[nodes.length - 1] === 'object' &&
    nodes[nodes.length - 1]['className'] === 'indexer'
    ? [nodes.pop()!]
    : [];
  for (
    let first = nodes[0];
    nodes.length > 0 &&
    !isVisible(first, 0) &&
    !(typeof first === 'object' && first.className === 'comment');
  ) {
    assert(nodes.length > 0);
    if (typeof first === 'string') {
      const pos = first.length - first.trimStart().length;
      if (pos > 0) {
        nodes[0] = first.slice(pos);
        break;
      }
    }
    nodes.pop();
  }
  return push(nodes, skip);
}
export function trimNodeEnd(nodes: (HTMLElement | string)[]): (HTMLElement | string)[] {
  const skip = nodes.length > 0 &&
    typeof nodes[nodes.length - 1] === 'object' &&
    nodes[nodes.length - 1]['className'] === 'indexer'
    ? [nodes.pop()!]
    : [];
  for (
    let last = nodes[0];
    nodes.length > 0 &&
    !isVisible(last = nodes[nodes.length - 1], -1) &&
    !(typeof last === 'object' && last.className === 'comment');
  ) {
    assert(nodes.length > 0);
    if (typeof last === 'string') {
      const pos = last.trimEnd().length;
      if (pos > 0) {
        nodes[nodes.length - 1] = last.slice(0, pos);
        break;
      }
    }
    nodes.pop();
  }
  return push(nodes, skip);
}
export function trimNodeEndBR<T extends HTMLElement | string>(nodes: T[]): T[];
export function trimNodeEndBR(nodes: (HTMLElement | string)[]): (HTMLElement | string)[] {
  if (nodes.length === 0) return nodes;
  const node = nodes[nodes.length - 1];
  return typeof node === 'object' && node.tagName === 'BR'
    ? pop(nodes)[0]
    : nodes;
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
      // Note: Can't express line breaks.
      acc += node.innerText;
    }
  }
  return acc;
}
