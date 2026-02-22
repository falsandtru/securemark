import { TextParser, TxtParser, LinebreakParser } from '../source';
import { Command } from '../context';
import { union, consume, focus } from '../../combinator';
import { html } from 'typed-dom/dom';

export const delimiter = /(?=[\\!@#$&"`\[\](){}<>（）［］｛｝*%|+~=/]|\s(?:\\?(?:$|\s)|[$*%|]|([+~=])\1)|\/{3}|:\/\/|\n)/g;
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
        ? nonWhitespace.test(source)
          ? nonWhitespace.lastIndex - 1
          : source.length
        : next(source, position, delimiter);
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

export function next(source: string, position: number, delimiter: RegExp): number {
  delimiter.lastIndex = position + 1;
  delimiter.test(source);
  let index = delimiter.lastIndex;
  if (index === 0) return source.length;
  assert(index > position);
  const char = source[index];
  switch (char) {
    case ':':
      index = backToUrlHead(source, position, index);
      break;
    case '@':
      index = backToEmailHead(source, position, index);
      break;
  }
  if (index > position + 1) switch (char) {
    case '*':
    case '+':
    case '~':
    case '=':
    case '/':
    case '%':
    case '|':
      index -= /\s/.test(source[index - 1]) ? 1 : 0;
  }
  assert(index > position);
  return index;
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

const blank = /\s(?:$|\s|\\\n)/y;
export function isBlank(source: string, position: number): boolean {
  blank.lastIndex = position;
  return blank.test(source);
}
export function isAlphanumeric(char: string): boolean {
  assert(char.length === 1);
  if (char < '0' || '\x7F' < char) return false;
  return '0' <= char && char <= '9'
      || 'a' <= char && char <= 'z'
      || 'A' <= char && char <= 'Z';
}
