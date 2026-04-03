import { TextParser, TxtParser } from '../source';
import { Result, Node } from '../../combinator/parser';
import { union, spend } from '../../combinator';
import { State, Command } from '../context';
import { Flag } from '../node';
import { isWhitespace } from './whitespace';
import { html } from 'typed-dom/dom';

export const nonWhitespace = /[^ \t　]/g;

export const text: TextParser = (input, output) => {
  const { source, position, state } = input;
  if (position === source.length) return;
  const char = source[position];
  spend(input, output, 1);
  input.position += 1;
  switch (char) {
    case Command.Escape:
    case '\\':
      switch (source[position + 1]) {
        case undefined:
          return Result.succ;
        case '\r':
        case '\n':
          assert(char !== Command.Escape);
          return Result.succ;
        default:
          spend(input, output, 1);
          input.position += 1;
          return output.append(new Node(source.slice(position + 1, input.position)));
      }
    case '\r':
      return Result.succ;
    case '\n':
      input.linebreak ||= source.length - position;
      return output.append(new Node(html('br'), Flag.blank));
    default:
      assert(char !== '\n');
      nonWhitespace.lastIndex = position + 1;
      const s = canSkip(source, position);
      let i = s
        ? nonWhitespace.test(source)
          ? nonWhitespace.lastIndex - 1
          : source.length
        : next(source, position, input.whitespace, state);
      assert(i > position);
      const lineend = 0
        || s && i === source.length
        || s && source[i] === '\r'
        || s && source[i] === '\n';
      i -= position;
      i = lineend ? i : i - +s || 1;
      spend(input, output, i - 1);
      input.position += i - 1;
      const linestart = position === 0 || source[position - 1] === '\n';
      if (position === input.position || s && !linestart || lineend) return Result.succ;
      return output.append(new Node(source.slice(position, input.position)));
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

function next(source: string, position: number, space: boolean, state: number): number {
  let index= seek(source, position, space, state);
  assert(index > position);
  if (index === source.length) return index;
  const char = source[index];
  switch (char) {
    case '%':
      assert(source.startsWith('%]', index) && isWhitespace(source[index - 1]));
      index += index - 1 > position
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
export function backToUrlHead(source: string, position: number, index: number): number {
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
export function backToEmailHead(source: string, position: number, index: number): number {
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
  if (char < '0' || 'z' < char) return false;
  if (char <= '9' || 'a' <= char) return true;
  return 'A' <= char && char <= 'Z';
}

function seek(source: string, position: number, space: boolean, state: number): number {
  for (let i = position + 1; i < source.length; ++i) {
    const char = source[i];
    switch (char) {
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
        if (source[i + 1] === char) return i;
        continue;
      case '/':
        if (source[i + 1] === char && source[i + 2] === char) return i;
        continue;
      case '%':
        if (source[i + 1] === ']' && isWhitespace(source[i - 1])) return i;
        continue;
      case ':':
        if (source[i + 1] === '/' && source[i + 2] === '/') return i;
        continue;
      case '&':
        if (source[i + 1] !== ' ') return i;
        continue;
      default:
        if (!isWhitespace(char)) continue;
        if (space) return i;
        if (i + 1 === source.length) return i;
        if (isWhitespace(source[i + 1])) return i;
        if (source[i + 1] !== '\\') continue;
        if (i + 2 === source.length) return i;
        if (isWhitespace(source[i + 2])) return i;
        continue;
    }
    assert(false);
  }
  return source.length;
}
