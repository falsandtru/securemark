import { TextParser, TxtParser } from '../source';
import { State, Command } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, consume } from '../../combinator';
import { html } from 'typed-dom/dom';

//const delimiter = /(?=[\\!@#$&"`\[\](){}<>（）［］｛｝*%|\r\n]|([+~=])\1|\/{3}|\s(?:\\?(?:$|\s)|[$%])|:\/\/)/g;
export const nonWhitespace = /[^ \t　]/g;

export const text: TextParser = input => {
  const { context } = input;
  const { source, position, state } = context;
  if (position === source.length) return;
  const char = source[position];
  consume(1, context);
  context.position += 1;
  switch (char) {
    case Command.Escape:
    case '\\':
      switch (source[position + 1]) {
        case undefined:
          return new List();
        case '\n':
          assert(char !== Command.Escape);
          return new List();
        default:
          consume(1, context);
          context.position += 1;
          return new List([new Node(source.slice(position + 1, context.position))]);
      }
    case '\r':
      consume(-1, context);
      return new List();
    case '\n':
      context.linebreak ||= source.length - position;
      return new List([new Node(html('br'))]);
    default:
      assert(char !== '\n');
      if (context.sequential) return new List([new Node(char)]);
      nonWhitespace.lastIndex = position + 1;
      const s = canSkip(source, position);
      let i = s
        ? nonWhitespace.test(source)
          ? nonWhitespace.lastIndex - 1
          : source.length
        : next(source, position, state);
      assert(i > position);
      const lineend = 0
        || s && i === source.length
        || s && source[i] === '\n';
      i -= position;
      i = lineend ? i : i - +s || 1;
      consume(i - 1, context);
      context.position += i - 1;
      const linestart = position === 0 || source[position - 1] === '\n';
      return position === context.position || s && !linestart || lineend
        ? new List()
        : new List([new Node(source.slice(position, context.position))]);
  }
};

export const txt: TxtParser = union([
  text,
]) as TxtParser;

export function canSkip(source: string, position: number): boolean {
  assert(position < source.length);
  if (!isWhitespace(source[position], false)) return false;
  if (position + 1 === source.length) return true;
  return isWhitespace(source[position + 1], true);
}
function isWhitespace(char: string, linebreak: boolean): boolean {
  switch (char) {
    case ' ':
    case '\t':
    case '　':
      return true;
    case '\r':
    case '\n':
      return linebreak;
    default:
      return false;
  }
}

export function next(source: string, position: number, state: number, delimiter?: RegExp): number {
  let index: number;
  if (delimiter) {
    delimiter.lastIndex = position + 1;
    delimiter.test(source);
    index = delimiter.lastIndex;
  }
  else {
    index = seek(source, position, state);
  }
  if (index === 0) return source.length;
  assert(index > position);
  const char = source[index];
  switch (char) {
    case '%':
      index += index - 1 > position && source.startsWith(' %]', index - 1)
        ? -1
        : 0;
      break;
    case '[':
      index += index - 1 > position && source.startsWith(' [|', index - 1)
        ? -1
        : 0;
      break;
    case ':':
      index = source.startsWith('//', index + 1)
        ? backToUrlHead(source, position, index)
        : index;
      break;
    case '@':
      index = ~state & State.autolink
        ? backToEmailHead(source, position, index)
        : index;
      break;
  }
  assert(index > position);
  return index;
}
function backToUrlHead(source: string, position: number, index: number): number {
  const delim = index;
  let state = false;
  for (let i = index - 1; i >= position; --i) {
    const char = source[i];
    if (state) switch (char) {
      case '.':
      case '+':
      case '-':
        state = false;
        continue;
    }
    if (isAlphanumeric(char)) {
      state = true;
      index = i;
      continue;
    }
    break;
  }
  return index === position || source[index] !== 'h'
    ? delim
    : index;
}
function backToEmailHead(source: string, position: number, index: number): number {
  const delim = index;
  let state = false;
  for (let i = index - 1; i >= position; --i) {
    const char = source[i];
    if (state) switch (char) {
      case '_':
      case '.':
      case '+':
      case '-':
        state = false;
        continue;
    }
    if (isAlphanumeric(char)) {
      state = true;
      index = i;
      continue;
    }
    break;
  }
  return index === position
    ? delim
    : index;
}
export function isAlphanumeric(char: string): boolean {
  assert(char.length === 1);
  if (char < '0' || '\x7F' < char) return false;
  return '0' <= char && char <= '9'
      || 'A' <= char && char <= 'Z'
      || 'a' <= char && char <= 'z';
}

//const dict = new class {
//  constructor() {
//    [
//      '\\',
//      '!',
//      '@',
//      '#',
//      '$',
//      '&',
//      '"',
//      '`',
//      '[',
//      ']',
//      '(',
//      ')',
//      '{',
//      '}',
//      '<',
//      '>',
//      '（',
//      '）',
//      '［',
//      '］',
//      '｛',
//      '｝',
//      '*',
//      '%',
//      '|',
//      '\r',
//      '\n',
//    ].forEach(c =>
//      this[c.charCodeAt(0)] = undefined);
//  }
//};

function seek(source: string, position: number, state: number): number {
  for (let i = position + 1; i < source.length; ++i) {
    const fst = source[i];
    //if (fst.charCodeAt(0) in dict) return i;
    switch (fst) {
      case '\\':
      case '!':
      case '$':
      case '"':
      case '`':
      case '[':
      case ']':
      case '(':
      case ')':
      case '{':
      case '}':
      case '<':
      case '>':
      case '（':
      case '）':
      case '［':
      case '］':
      case '｛':
      case '｝':
      case '*':
      case '|':
      case '\r':
      case '\n':
        return i;
      case '@':
      case '#':
        if (~state & State.autolink) return i;
        continue;
      case '+':
      case '~':
      case '=':
        if (source[i + 1] === fst) return i;
        continue;
      case '/':
        if (source[i + 1] === fst && source[i + 2] === fst) return i;
        continue;
      case '%':
        if (source[i + 1] === ']') return i;
        continue;
      case ':':
        if (source[i + 1] === '/' && source[i + 2] === '/') return i;
        continue;
      case '&':
        if (source[i + 1] !== ' ') return i;
        continue;
      case ' ':
      case '\t':
      case '　':
        if (i + 1 === source.length) return i;
        switch (source[i + 1]) {
          case ' ':
          case '\t':
          case '\r':
          case '\n':
          case '　':
            return i;
          case '\\':
            if (i + 2 === source.length) return i;
            switch (source[i + 2]) {
              case ' ':
              case '\t':
              case '\r':
              case '\n':
              case '　':
                return i;
            }
        }
        continue;
      default:
        continue;
    }
    assert(false);
  }
  return source.length;
}
