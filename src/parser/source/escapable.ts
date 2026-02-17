import { EscapableSourceParser } from '../source';
import { Command } from '../context';
import { consume } from '../../combinator';
import { nonWhitespace, nonAlphanumeric, isAlphanumeric } from './text';
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
      const b = source[position].trimStart() === '';
      let i = b || isAlphanumeric(source[position])
        ? source.slice(position).search(b ? nonWhitespace : nonAlphanumeric) || 1
        : 1;
      assert(i > 0);
      i = i - +b || 1;
      consume(i - 1, context);
      context.position += i - 1;
      return [[source.slice(position, position + i)]];
  }
};
