import { UnescapableSourceParser } from '../source';
import { Result, Node } from '../../combinator/parser';
import { spend } from '../../combinator';
import { State, Command } from '../context';
import { Flag } from '../node';
import { nonWhitespace, canSkip, backToUrlHead, backToEmailHead } from './text';
import { html } from 'typed-dom/dom';

export const unescsource: UnescapableSourceParser = (input, output) => {
  const { source, position, state } = input;
  if (position === source.length) return;
  const char = source[position];
  spend(input, output, 1);
  input.position += 1;
  switch (char) {
    case Command.Escape:
      spend(input, output, 1);
      input.position += 1;
      return output.append(new Node(source.slice(position + 1, position + 2)));
    case '\r':
      return Result.succ;
    case '\n':
      input.linebreak ||= source.length - position;
      return output.append(new Node(html('br'), Flag.blank));
    default:
      assert(char !== '\n');
      nonWhitespace.lastIndex = position + 1;
      let i = canSkip(source, position)
        ? nonWhitespace.test(source)
          ? nonWhitespace.lastIndex - 1
          : source.length
        : next(source, position, state);
      assert(i > position);
      i -= position;
      spend(input, output, i - 1);
      input.position += i - 1;
      return output.append(new Node(source.slice(position, input.position)));
  }
};

function next(source: string, position: number, state: number): number {
  let index= seek(source, position, state);
  assert(index > position);
  if (index === source.length) return index;
  const char = source[index];
  switch (char) {
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

function seek(source: string, position: number, state: number): number {
  const cat = category(source[position]);
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
      case '-':
      case '+':
      case '*':
      case '=':
      case '~':
      case '^':
      case '_':
      case ',':
      case '.':
      case ';':
      case ':':
      case '!':
      case '?':
      case '/':
      case '|':
      case '\r':
      case '\n':
        return i;
      case '@':
      case '#':
        if (~state & State.autolink) return i;
        continue;
      case ':':
        if (source[i + 1] === '/' && source[i + 2] === '/') return i;
        continue;
      default:
        if (cat && !category(char)) return i;
        continue;
    }
    assert(false);
  }
  return source.length;
}

function category(char: string): boolean {
  return char <= '\x7E' && '\x21' <= char;
}
