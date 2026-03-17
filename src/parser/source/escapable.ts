import { EscapableSourceParser } from '../source';
import { Command } from '../context';
import { Flag } from '../node';
import { List, Node } from '../../combinator/data/parser';
import { consume } from '../../combinator';
import { next } from './text';
import { html } from 'typed-dom/dom';

const delimiter = /(?=[\\$"`\[\](){}\r\n]|\s\$|:\/\/)/g;

export const escsource: EscapableSourceParser = context => {
  const { source, position, state } = context;
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
          return new List([new Node(char)]);
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
      let i = next(source, position, state, delimiter);
      assert(i > position);
      i -= position;
      consume(i - 1, context);
      context.position += i - 1;
      return new List([new Node(source.slice(position, context.position))]);
  }
};
