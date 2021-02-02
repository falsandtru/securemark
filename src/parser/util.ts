import { undefined } from 'spica/global';
import { MarkdownParser } from '../../markdown';
import { Parser, Ctx, union, verify, convert, eval, fmap } from '../combinator';
import { Data, SubParsers, Context } from '../combinator/data/parser';
import { comment } from './inline/comment';
import { htmlentity } from './inline/htmlentity';
import { pop } from 'spica/array';

export function visualize<P extends Parser<HTMLElement | string>>(parser: P, message?: string): P;
export function visualize<T extends HTMLElement | string>(parser: Parser<T>, message = '(Empty)'): Parser<T> {
  assert(message.trim());
  return justify(union([
    verify(parser, (ns, rest, context) => !rest && hasVisible(ns, context)),
    (source: string) => [[source.trim() || message], ''],
  ]));
}
function justify<P extends Parser<unknown>>(parser: P): P;
function justify<T>(parser: Parser<T>): Parser<T> {
  const entities = [
    'Tab',
    'NewLine',
    'nbsp',
    'NonBreakingSpace',
    'shy',
    'ensp',
    'emsp',
    'emsp13',
    'emsp14',
    'numsp',
    'puncsp',
    'thinsp',
    'ThinSpace',
    'hairsp',
    'VeryThinSpace',
    'ZeroWidthSpace',
    'NegativeVeryThinSpace',
    'NegativeThinSpace',
    'NegativeMediumSpace',
    'NegativeThickSpace',
    'zwnj',
    'zwj',
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
  const blankline = new RegExp(String.raw`^(?:\\?\s|&(?:${entities.join('|')});)*\\?(?:\n|$)`, 'gm');
  return convert(source => source.replace(blankline, visualize), parser);

  function visualize(line: string): string {
    switch (line) {
      case '':
      case '\n':
        return '';
      default:
        return line.replace(/[\\&]/g, '\\$&');
    }
  }
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
      if (media && node.getElementsByClassName('media').length > 0) return true;
    }
  }
  return false;
}

export function startTight<P extends Parser<unknown>>(parser: P): P;
export function startTight<T>(parser: Parser<T>): Parser<T> {
  return (source, context) => {
    if (source === '') return;
    switch (source[0]) {
      case ' ':
      case '　':
      case '\t':
      case '\n':
        return;
      case '&':
        switch (true) {
          case source.length > 2
            && source[1] !== ' '
            && eval(htmlentity(source, context))?.[0].trimStart() == '':
            return;
        }
        break;
      case '<':
        switch (true) {
          case source.length >= 7
            && source[1] === '#'
            && !!comment(source, context):
          case source.length >= 5
            && source[1] === 'w'
            && source.slice(0, 5) === '<wbr>':
          case source.length >= 4
            && source[1] === 'b'
            && source.slice(0, 4) === '<br>':
            return;
        }
        break;
    }
    return (source[0] === '\\' ? source[1] : source[0])?.trimStart()
      ? parser(source, context)
      : undefined;
  }
}

export function isEndTight(nodes: readonly (HTMLElement | string)[]): boolean {
  if (nodes.length === 0) return true;
  const last = nodes.length - 1;
  return typeof nodes[last] === 'string' && (nodes[last] as string).length > 1
    ? isVisible(nodes[last], 'end', 0) ||
      isVisible(nodes[last], 'end', 1)
    : isVisible(nodes[last], 'end') || last === 0 ||
      isVisible(nodes[last - 1], 'end');
}
function isVisible(node: HTMLElement | string | undefined, dir: 'start' | 'end', offset = 0): boolean {
  assert(offset >= 0);
  if (!node) return false;
  switch (typeof node) {
    case 'string':
      const char = node[dir === 'start' ? 0 + offset : node.length - 1 - offset];
      assert(char);
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

export function dup<P extends Parser<unknown[]>>(parser: Parser<Data<P>[number], SubParsers<P>, Context<P>>): P;
export function dup<T, D extends Parser<unknown, any, C>[], C extends Ctx>(parser: Parser<T, D, C>): Parser<T[], D, C>;
export function dup<T>(parser: Parser<T>): Parser<T[]> {
  return fmap(parser, ns => [ns]);
}

export function stringify(nodes: readonly (HTMLElement | string)[]): string {
  let acc = '';
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    acc += typeof node === 'string'
      ? node
      : node.tagName === 'BR'
        ? '\n'
        : node.innerText;
  }
  return acc;
}
