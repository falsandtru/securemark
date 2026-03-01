import { UnescapableSourceParser } from '../source';
import { Command } from '../context';
import { List, Data } from '../../combinator/data/parser';
import { consume } from '../../combinator';
import { nonWhitespace, canSkip, next } from './text';
import { html } from 'typed-dom/dom';

export const delimiter = /(?=(?=[\x00-\x7F])[^0-9A-Za-z]|(?<=[\x00-\x7F])[^\x00-\x7F])/g;

export const unescsource: UnescapableSourceParser = ({ context }) => {
  const { source, position } = context;
  if (position === source.length) return;
  const char = source[position];
  consume(1, context);
  context.position += 1;
  switch (char) {
    case '\r':
      assert(!source.includes('\r', position + 1));
      consume(-1, context);
      return new List();
    case Command.Escape:
      consume(1, context);
      context.position += 1;
      return new List([new Data(source.slice(position + 1, position + 2))]);
    case '\n':
      context.linebreak ||= source.length - position;
      return new List([new Data(html('br'))]);
    default:
      assert(char !== '\n');
      if (context.sequential) return new List([new Data(char)]);
      nonWhitespace.lastIndex = position + 1;
      let i = canSkip(source, position)
        ? nonWhitespace.test(source)
          ? nonWhitespace.lastIndex - 1
          : source.length
        : next(source, position, delimiter);
      assert(i > position);
      i -= position;
      consume(i - 1, context);
      context.position += i - 1;
      return new List([new Data(source.slice(position, context.position))]);
  }
};
