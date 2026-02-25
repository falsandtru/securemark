import { TextParser, TxtParser, LinebreakParser } from '../source';
import { Command } from '../context';
import { union, consume, focus } from '../../combinator';
import { html } from 'typed-dom/dom';

//const delimiter = /(?=[\\!@#$&"`\[\](){}<>（）［］｛｝*%|\r\n]|([+~=])\1|\/{3}|\s(?:\\?(?:$|\s)|[$%])|:\/\/)/g;
export const nonWhitespace = /[\S\r\n]/g;

export const text: TextParser = input => {
  const { context } = input;
  const { source, position } = context;
  if (position === source.length) return;
  const char = source[position];
  consume(1, context);
  context.position += 1;
  switch (char) {
    case '\r':
      assert(!source.includes('\r', position + 1));
      consume(-1, context);
      return [[]];
    case Command.Escape:
    case '\\':
      switch (source[position + 1]) {
        case undefined:
          return [[]];
        case '\n':
          assert(char !== Command.Escape);
          return [[]];
        default:
          consume(1, context);
          context.position += 1;
          return [[source.slice(position + 1, context.position)]];
      }
    case '\n':
      context.linebreak ||= source.length - position;
      return [[html('br')]];
    default:
      assert(char !== '\n');
      if (context.sequential) return [[char]];
      nonWhitespace.lastIndex = position + 1;
      const b = isBlank(source, position);
      let i = b
        ? source[position + 1] === '\n'
          ? position + 1
          : nonWhitespace.test(source)
            ? nonWhitespace.lastIndex - 1
            : source.length
        : next(source, position);
      assert(i > position);
      const lineend = 0
        || b && i === source.length
        || b && source[i] === '\n'
        || b && source[i] === '\\' && source[i + 1] === '\n';
      i -= position;
      i = lineend ? i : i - +b || 1;
      consume(i - 1, context);
      context.position += i - 1;
      const linestart = position === 0 || source[position - 1] === '\n';
      i = linestart && b && i >= 3 ? i - 3 : 0;
      i += position;
      return i === context.position || b && !linestart || lineend
        ? [[]]
        : [[source.slice(i, context.position)]];
  }
};

export const txt: TxtParser = union([
  text,
]) as TxtParser;

export const linebreak: LinebreakParser = focus(/[\r\n]/y, union([
  text,
])) as LinebreakParser;

export function next(source: string, position: number, delimiter?: RegExp): number {
  let index: number;
  if (delimiter) {
    delimiter.lastIndex = position + 1;
    delimiter.test(source);
    index = delimiter.lastIndex;
  }
  else {
    index = seek(source, position);
  }
  if (index === 0) return source.length;
  assert(index > position);
  const char = source[index];
  switch (char) {
    case '$':
    case '%':
    case '*':
    case '+':
    case '~':
    case '=':
    case '/':
      index = backToWhitespace(source, position, index);
      break;
    case '[':
      index = source[index + 1] === '|'
        ? backToWhitespace(source, position, index)
        : index;
      break;
    case ':':
      index = source.startsWith('//', index + 1)
        ? backToUrlHead(source, position, index)
        : index;
      break;
    case '@':
      index = backToEmailHead(source, position, index);
      break;
  }
  assert(index > position);
  return index;
}
export function backToWhitespace(source: string, position: number, index: number): number {
  const prev = index - 1;
  return prev > position && /\s/.test(source[prev])
    ? prev
    : index;
}
export function backToUrlHead(source: string, position: number, index: number): number {
  const delim = index;
  let state = false;
  let offset = 0;
  for (let i = index; --i > position;) {
    index = i;
    const char = source[i];
    if (state) switch (char) {
      case '.':
      case '+':
      case '-':
        state = false;
        offset = 1;
        continue;
    }
    if (isAlphanumeric(char)) {
      state = true;
      offset = 0;
      continue;
    }
    break;
  }
  if (index === position + 1 && offset === 0 && isAlphanumeric(source[index - 1])) {
    return delim;
  }
  return index + offset;
}
export function backToEmailHead(source: string, position: number, index: number): number {
  const delim = index;
  let state = false;
  let offset = 0;
  for (let i = index; --i > position;) {
    index = i;
    const char = source[i];
    if (state) switch (char) {
      case '_':
      case '.':
      case '+':
      case '-':
        state = false;
        offset = 1;
        continue;
    }
    if (isAlphanumeric(char)) {
      state = true;
      offset = 0;
      continue;
    }
    break;
  }
  if (index === position + 1 && offset === 0 && isAlphanumeric(source[index - 1])) {
    return delim;
  }
  return index + offset;
}

function isAlphanumeric(char: string): boolean {
  assert(char.length === 1);
  if (char < '0' || '\x7F' < char) return false;
  return '0' <= char && char <= '9'
      || 'a' <= char && char <= 'z'
      || 'A' <= char && char <= 'Z';
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

//const delimiter = /\s(?:\\?(?:$|\s)|[$%])/y;

function seek(source: string, position: number): number {
  for (let i = position + 1; i < source.length; ++i) {
    const fst = source[i];
    //if (fst.charCodeAt(0) in dict) return i;
    switch (fst) {
      case '\\':
      case '!':
      case '@':
      case '#':
      case '$':
      case '&':
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
        //delimiter.lastIndex = i;
        //if (delimiter.test(source)) return i;
        continue;
    }
    assert(false);
  }
  return source.length;
}

const blank = /\s(?:$|\s|\\\n)/y;
export function isBlank(source: string, position: number): boolean {
  blank.lastIndex = position;
  return blank.test(source);
  assert(position < source.length);
  if (!isWhitespace(source[position])) return false;
  if (position + 1 === source.length) return true;
  const snd = source[position + 1];
  if (isWhitespace(snd)) return true;
  if (position + 2 === source.length) return false;
  if (snd === '\\' && source[position + 2] === '\n') return true;
  return false;
}
const whitespace = /\s/;
export function isWhitespace(char: string): boolean {
  whitespace;
  switch (char) {
    case ' ':
    case '\t':
    case '\r':
    case '\n':
    case '　':
      return true
    default:
      return false;
  }
}
