import { UnescapableSourceParser } from '../source';
import { Command } from '../context';
import { consume } from '../../combinator';
import { nonWhitespace, nonAlphanumeric, ASCII, isBlank, isAlphanumeric, isASCII } from './text';
import { html } from 'typed-dom/dom';

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
      return [[]];
    case Command.Escape:
      consume(1, context);
      context.position += 1;
      return [[source.slice(position + 1, position + 2)]];
    case '\n':
      context.linebreak ||= source.length - position;
      return [[html('br')]];
    default:
      assert(char !== '\n');
      if (context.sequential) return [[char]];
      nonAlphanumeric.lastIndex = position + 1;
      nonWhitespace.lastIndex = position + 1;
      ASCII.lastIndex = position + 1;
      const b = isBlank(source, position);
      let i = b
        ? nonWhitespace.test(source)
          ? nonWhitespace.lastIndex - 1
          : source.length
        : isAlphanumeric(char)
          ? nonAlphanumeric.test(source)
            ? nonAlphanumeric.lastIndex - 1
            : source.length
          : !isASCII(char)
            ? ASCII.test(source)
              ? ASCII.lastIndex - 1
              : source.length
            : position + 1;
      assert(i > position);
      i -= position;
      consume(i - 1, context);
      context.position += i - 1;
      return [[source.slice(position, context.position)]];
  }
};
