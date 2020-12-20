import { undefined } from 'spica/global';
import { isArray } from 'spica/alias';
import { Parser, Ctx, eval, fmap } from '../combinator';
import { comment } from './inline/comment';
import { htmlentity } from './inline/htmlentity';
import { uuid } from 'spica/uuid';
import { pop } from 'spica/array';
import { define } from 'typed-dom';

export function isEndTight(nodes: readonly (HTMLElement | string)[]): boolean {
  if (nodes.length === 0) return true;
  //assert(isVisible(nodes[0], 'start'));
  const end = nodes.length - 1;
  return typeof nodes[end] === 'string' && (nodes[end] as string).length > 1
    ? isVisible(nodes[end], 'end', 0) ||
      isVisible(nodes[end], 'end', 1)
    : isVisible(nodes[end], 'end') || end === 0 ||
      isVisible(nodes[end - 1], 'end');
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

export function startTight<P extends Parser<unknown>>(parser: P): P;
export function startTight<T, D extends Parser<unknown, any>[]>(parser: Parser<T, D>): Parser<T, D> {
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

export function trimEnd<T extends HTMLElement | string>(nodes: T[]): T[];
export function trimEnd(nodes: (HTMLElement | string)[]): (HTMLElement | string)[] {
  if (nodes.length === 0) return nodes;
  const node = nodes[nodes.length - 1];
  return typeof node === 'object' && node.tagName === 'BR'
    ? pop(nodes)[0]
    : nodes;
}

export function dup<T, D extends Parser<unknown, any, C>[], C extends Ctx>(parser: Parser<T, D, C>): Parser<T[], D, C> {
  return fmap(parser, ns => [ns]);
}

export function defrag(nodes: readonly (HTMLElement | string)[]): (HTMLElement | string)[] {
  assert(nodes.every(n => typeof n === 'string' || n instanceof HTMLElement));
  const acc: (HTMLElement | string)[] = [];
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    if (node === '') continue;
    if (acc.length === 0 || typeof node === 'object' || typeof nodes[i - 1] === 'object') {
      acc.push(node);
    }
    else {
      assert(acc.length > 0);
      assert(typeof node === 'string');
      assert(typeof nodes[i - 1] === 'string');
      acc[acc.length - 1] += node;
    }
  }
  return acc;
}

export function stringify(node: HTMLElement | string): string;
export function stringify(nodes: readonly (HTMLElement | string)[]): string;
export function stringify(nodes: HTMLElement | string | readonly (HTMLElement | string)[]): string {
  if (typeof nodes === 'string') return nodes;
  if (!isArray(nodes)) return nodes.innerText;
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

export function error<P extends Parser<HTMLElement>>(parser: P): P;
export function error<T extends HTMLElement, D extends Parser<unknown>[]>(parser: Parser<T, D>): Parser<T, D> {
  return (source, context) =>
    source[0] === '\0'
      ? fmap(parser, ([el]) => [
          define(el, {
            id: `error:${uuid()}`,
            class: 'error',
          })
        ])(source.slice(1), context)
      : parser(source, context);
}
