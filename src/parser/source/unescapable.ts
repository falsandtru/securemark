import { UnescapableSourceParser } from '../source';
import { Command } from '../context';
import { consume } from '../../combinator';
import { blank, nonWhitespace, nonAlphanumeric, ASCII, isAlphanumeric, isASCII } from './text';
import { html } from 'typed-dom/dom';

export const unescsource: UnescapableSourceParser = ({ context }) => {
  const { source, position } = context;
  if (position === source.length) return;
  consume(1, context);
  context.position += 1;
  switch (source[position]) {
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
      assert(source[position] !== '\n');
      if (context.sequential) return [[source[position]]];
      blank.lastIndex = position;
      nonAlphanumeric.lastIndex = position + 1;
      nonWhitespace.lastIndex = position + 1;
      ASCII.lastIndex = position + 1;
      const b = blank.test(source);
      let i = b
        ? nonWhitespace.test(source)
          ? nonWhitespace.lastIndex - 1
          : source.length
        : isAlphanumeric(source[position])
          ? nonAlphanumeric.test(source)
            ? nonAlphanumeric.lastIndex - 1
            : source.length
          : !isASCII(source[position])
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
