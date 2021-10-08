import { undefined } from 'spica/global';
import { MarkdownParser } from '../../markdown';
import { Parser, eval } from '../combinator/data/parser';
import { union, some, verify, clear, convert, trim } from '../combinator';
import { comment } from './inline/comment';
import { htmlentity } from './inline/htmlentity';
import { linebreak, unescsource, str } from './source';
import { html, defrag } from 'typed-dom';
import { pop } from 'spica/array';

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
const blankline = new RegExp(String.raw`^(?!\n|$)(?:\\?\s|&(?:${invisibleHTMLEntityNames.join('|')});|<wbr>)*\\?(?:\n|$)`, 'gm');

export function visualize<P extends Parser<HTMLElement | string>>(parser: P): P;
export function visualize<T extends HTMLElement | string>(parser: Parser<T>): Parser<T> {
  return justify(union([
    verify(parser, (ns, rest, context) => !rest && hasVisible(ns, context)),
    trim(some(union([clear(str('\x7F\\')), linebreak, unescsource]))),
  ]));
}
function justify<P extends Parser<unknown>>(parser: P): P;
function justify<T>(parser: Parser<T>): Parser<T> {
  return convert(
    source => source.replace(blankline, line => line.replace(/[\\&<]/g, '\x7F\\$&')),
    parser);
}
function hasVisible(
  nodes: readonly (HTMLElement | string)[],
  { syntax: { inline: { media = true } = {} } = {} }: MarkdownParser.Context,
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

export function startTight<P extends Parser<unknown>>(parser: P): P;
export function startTight<T>(parser: Parser<T>): Parser<T> {
  return (source, context) => {
    if (source === '') return;
    if (!isStartTight(source, context)) return;
    return (source[0] === '\\' ? source[1] : source[0])?.trimStart()
      ? parser(source, context)
      : undefined;
  }
}

export function isStartTight(source: string, context: MarkdownParser.Context): boolean {
  if (source === '') return true;
  switch (source[0]) {
    case ' ':
    case '　':
    case '\t':
    case '\n':
      return false;
    case '&':
      switch (true) {
        case source.length > 2
          && source[1] !== ' '
          && eval(htmlentity(source, context))?.[0].trimStart() == '':
          return false;
      }
      return true;
    case '[':
      switch (true) {
        case source.length >= 7
          && source[1] === '#'
          && !!comment(source, context):
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
      return true;
  }
}
export function verifyStartTight(nodes: readonly (HTMLElement | string)[]): boolean {
  if (nodes.length === 0) return true;
  return isVisible(nodes[0]);
}
export function verifyEndTight(nodes: readonly (HTMLElement | string)[]): boolean {
  if (nodes.length === 0) return true;
  const last = nodes.length - 1;
  return typeof nodes[last] === 'string' && (nodes[last] as string).length > 1
    ? isVisible(nodes[last], -1) ||
      isVisible(nodes[last], -2)
    : isVisible(nodes[last], -1) || last === 0 ||
      isVisible(nodes[last - 1], -1);
}
export function markVerboseTail(nodes: (HTMLElement | string)[]): (HTMLElement | string)[] {
  assert(verifyStartTight(nodes));
  if (verifyEndTight(nodes)) return nodes;
  const invisibles: typeof nodes = [];
  for (
    let last = nodes[0];
    last = nodes[nodes.length - 1],
    typeof last === 'string' && last.length > 1
      ? !isVisible(last, -2)
      : !isVisible(nodes[nodes.length - 2], -1);
  ) {
    assert(nodes.length > 0);
    if (typeof last === 'string' && last.length > 1) {
      const pos = last.trimEnd().length + 1;
      invisibles.unshift(last.slice(pos));
      nodes[nodes.length - 1] = last.slice(0, pos);
      break;
    }
    else {
      invisibles.unshift(nodes.pop()!);
    }
  }
  nodes.push(html('span', {
    class: 'invalid',
    'data-invalid-syntax': 'invisible',
    'data-invalid-type': 'invisible',
    'data-invalid-description': 'Cannot end with invisibles in the syntax.',
  }, defrag(invisibles)));
  return nodes;
}
function isVisible(node: HTMLElement | string | undefined, position = 0): boolean {
  if (!node) return false;
  switch (typeof node) {
    case 'string':
      assert(node.length + position >= 0);
      const char = node[position >= 0 ? position : node.length + position];
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

export function trimEndBR<T extends HTMLElement | string>(nodes: T[]): T[];
export function trimEndBR(nodes: (HTMLElement | string)[]): (HTMLElement | string)[] {
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
      assert(!node.matches('br'));
      assert(!node.querySelector('br'));
      // Note: Can't express line breaks.
      acc += node.innerText;
    }
  }
  return acc;
}
