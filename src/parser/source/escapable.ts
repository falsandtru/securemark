import { EscapableSourceParser } from '../source';
import { Command } from '../context';
import { Flag } from '../node';
import { List, Node } from '../../combinator/data/parser';
import { consume } from '../../combinator';
import { html } from 'typed-dom/dom';

export const escsource: EscapableSourceParser = context => {
  const { source, position } = context;
  if (position === source.length) return;
  const char = source[position];
  consume(1, context);
  context.position += 1;
  switch (char) {
    case Command.Escape:
      consume(1, context);
      context.position += 1;
      return new List([new Node(source.slice(position + 1, position + 2))]);
    case '\\':
      switch (source[position + 1]) {
        case undefined:
        case '\r':
        case '\n':
          return new List([new Node(char)]);
        default:
          consume(1, context);
          context.position += 1;
          return new List([new Node(source.slice(position, position + 2))]);
      }
    case '\r':
      return new List();
    case '\n':
      context.linebreak ||= source.length - position;
      return new List([new Node(html('br'), Flag.blank)]);
    default:
      assert(char !== '\n');
      if (context.sequential) return new List([new Node(char)]);
      let i = seek(source, position);
      assert(i > position);
      i -= position;
      consume(i - 1, context);
      context.position += i - 1;
      return new List([new Node(source.slice(position, context.position))]);
  }
};

function seek(source: string, position: number): number {
  for (let i = position + 1; i < source.length; ++i) {
    const char = source[i];
    switch (char) {
      case '\\':
      case '$':
      case '"':
      case '`':
      case ':':
      case '[':
      case ']':
      case '(':
      case ')':
      case '{':
      case '}':
      case '\r':
      case '\n':
        return i;
      default:
        continue;
    }
    assert(false);
  }
  return source.length;
}
