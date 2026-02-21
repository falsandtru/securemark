import { EscapableSourceParser } from '../source';
import { Command } from '../context';
import { consume } from '../../combinator';
import { blank, nonWhitespace, nonAlphanumeric, isAlphanumeric } from './text';
import { html } from 'typed-dom/dom';

export const escsource: EscapableSourceParser = ({ context }) => {
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
    case '\\':
      switch (source[position + 1]) {
        case undefined:
          return [[source[position]]];
        case '\n':
          return [[source[position]]];
        default:
          consume(1, context);
          context.position += 1;
          return [[source.slice(position, position + 2)]];
      }
    case '\n':
      context.linebreak ||= source.length - position;
      return [[html('br')]];
    default:
      assert(source[position] !== '\n');
      blank.lastIndex = position;
      nonAlphanumeric.lastIndex = position + 1;
      nonWhitespace.lastIndex = position + 1;
      const b = blank.test(source);
      let i = b
        ? nonWhitespace.test(source)
          ? nonWhitespace.lastIndex - 1
          : source.length
        : isAlphanumeric(source[position])
          ? nonAlphanumeric.test(source)
            ? nonAlphanumeric.lastIndex - 1
            : source.length
          : position + 1;
      assert(i > position);
      i -= position;
      consume(i - 1, context);
      context.position += i - 1;
      return [[source.slice(position, context.position)]];
  }
};
