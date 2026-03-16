import { UnescapableSourceParser } from '../source';
import { Command } from '../context';
import { Flag } from '../node';
import { List, Node } from '../../combinator/data/parser';
import { consume } from '../../combinator';
import { nonWhitespace, canSkip, next } from './text';
import { html } from 'typed-dom/dom';

export const delimiter = /(?=(?=[\x00-\x7F])[^0-9A-Za-z]|(?<=[\x00-\x7F])[^\x00-\x7F])/g;

export const unescsource: UnescapableSourceParser = context => {
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
        : next(source, position, state, delimiter);
      assert(i > position);
      i -= position;
      consume(i - 1, context);
      context.position += i - 1;
      return new List([new Node(source.slice(position, context.position))]);
  }
};
