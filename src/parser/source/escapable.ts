import { EscapableSourceParser } from '../source';
import { Command } from '../context';
import { consume } from '../../combinator';
import { nonWhitespace, isBlank, next } from './text';
import { html } from 'typed-dom/dom';

const delimiter = /(?=[\\$"`\[\](){}\r\n]|\s(?:\$)|:\/\/)/g;

export const escsource: EscapableSourceParser = ({ context }) => {
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
      consume(1, context);
      context.position += 1;
      return [[source.slice(position + 1, position + 2)]];
    case '\\':
      switch (source[position + 1]) {
        case undefined:
          return [[char]];
        case '\n':
          return [[char]];
        default:
          consume(1, context);
          context.position += 1;
          return [[source.slice(position, position + 2)]];
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
        : next(source, position, delimiter);
      assert(i > position);
      i -= position;
      consume(i - 1, context);
      context.position += i - 1;
      return [[source.slice(position, context.position)]];
  }
};
