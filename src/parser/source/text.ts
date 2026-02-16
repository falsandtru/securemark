import { TextParser, TxtParser, LinebreakParser } from '../source';
import { Command } from '../context';
import { input } from '../../combinator/data/parser';
import { union, consume, focus } from '../../combinator';
import { str } from './str';
import { html } from 'typed-dom/dom';

export const delimiter = /[\s\x00-\x7F（）［］｛｝]|\S#|[0-9A-Za-z]>/;
export const nonWhitespace = /[\S\n]|$/;
export const nonAlphanumeric = /[^0-9A-Za-z]|\S#|[0-9A-Za-z]>|$/;
const repeat = str(/^(.)\1*/);

export const text: TextParser = ({ context }) => {
  const { source, position } = context;
  if (position === source.length) return;
  consume(1, context);
  context.position += 1;
  switch (source[position]) {
    case '\r':
      assert(!source.includes('\r', position + 1));
      consume(-1, context);
      return [[], source.slice(position + 1)];
    case Command.Escape:
    case '\\':
      switch (source[position + 1]) {
        case undefined:
          return [[], ''];
        case '\n':
          assert(source[0] !== Command.Escape);
          return [[], source.slice(position + 1)];
        default:
          consume(1, context);
          context.position += 1;
          return [[source.slice(position + 1, position + 2)], source.slice(position + 2)];
      }
    case '\n':
      context.linebreak ||= source.length - position;
      return [[html('br')], source.slice(position + 1)];
    case '*':
    case '`':
      return source[position + 1] === source[position + 0]
        ? repeat(input(source.slice(position), context))
        : [[source[position]], source.slice(position + 1)];
    default:
      assert(source[position] !== '\n');
      const t = source.slice(position, position + 2).trimStart();
      const b = t === ''
        ? true
        : t === '\\' && source[position + 1] === '\\' && source[position + 2] === '\n';
      let i = b || isAlphanumeric(source[position])
        ? source.slice(position).search(b ? nonWhitespace : nonAlphanumeric) || 1
        : 1;
      assert(i > 0);
      assert(!['\\', '\n'].includes(source[position]));
      const state = 0
        || b && i === source.length - position
        || b && source[position + i] === '\n'
        || b && source[position + i] === '\\' && source[position + i + 1] === '\n';
      i = state ? i : i - +b || 1;
      consume(i - 1, context);
      context.position += i - 1;
      return state
        ? [[], source.slice(position + i)]
        : [[source.slice(position, position + i)], source.slice(position + i)];
  }
};

export const txt: TxtParser = union([
  text,
]) as TxtParser;

export const linebreak: LinebreakParser = focus(/^[\r\n]/, union([
  text,
])) as LinebreakParser;

export function isAlphanumeric(char: string): boolean {
  assert(char.length === 1);
  if (char < '0' || '\x7F' < char) return false;
  return '0' <= char && char <= '9'
      || 'a' <= char && char <= 'z'
      || 'A' <= char && char <= 'Z';
}
