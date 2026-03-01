import { EscapableSourceParser } from '../source';
import { Command } from '../context';
import { List, Data } from '../../combinator/data/parser';
import { consume } from '../../combinator';
import { next } from './text';
import { html } from 'typed-dom/dom';

const delimiter = /(?=[\\$"`\[\](){}\r\n]|\s\$|:\/\/)/g;

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
      return [new List()];
    case Command.Escape:
      consume(1, context);
      context.position += 1;
      return [new List([new Data(source.slice(position + 1, position + 2))])];
    case '\\':
      switch (source[position + 1]) {
        case undefined:
          return [new List([new Data(char)])];
        case '\n':
          return [new List([new Data(char)])];
        default:
          consume(1, context);
          context.position += 1;
          return [new List([new Data(source.slice(position, position + 2))])];
      }
    case '\n':
      context.linebreak ||= source.length - position;
      return [new List([new Data(html('br'))])];
    default:
      assert(char !== '\n');
      if (context.sequential) return [new List([new Data(char)])];
      let i = next(source, position, delimiter);
      assert(i > position);
      i -= position;
      consume(i - 1, context);
      context.position += i - 1;
      return [new List([new Data(source.slice(position, context.position))])];
  }
};
