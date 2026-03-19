import { UnescapableSourceParser } from '../source';
import { State, Command } from '../context';
import { Flag } from '../node';
import { List, Node } from '../../combinator/data/parser';
import { spend } from '../../combinator';
import { nonWhitespace, canSkip, backToUrlHead, backToEmailHead } from './text';
import { html } from 'typed-dom/dom';

export const unescsource: UnescapableSourceParser = context => {
  const { source, position, state } = context;
  if (position === source.length) return;
  const char = source[position];
  spend(context, 1);
  context.position += 1;
  switch (char) {
    case Command.Escape:
      spend(context, 1);
      context.position += 1;
      return new List([new Node(source.slice(position + 1, position + 2))]);
    case '\r':
      return new List();
    case '\n':
      context.linebreak ||= source.length - position;
      return new List([new Node(html('br'), Flag.blank)]);
    default:
      assert(char !== '\n');
      if (context.sequential) return new List([new Node(char)]);
      nonWhitespace.lastIndex = position + 1;
      let i = canSkip(source, position)
        ? nonWhitespace.test(source)
          ? nonWhitespace.lastIndex - 1
          : source.length
        : next(source, position, state);
      assert(i > position);
      i -= position;
      spend(context, i - 1);
      context.position += i - 1;
      return new List([new Node(source.slice(position, context.position))]);
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
