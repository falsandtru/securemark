import { TextParser, TxtParser, LinebreakParser } from '../source';
import { Command } from '../context';
import { union, consume, focus } from '../../combinator';
import { html } from 'typed-dom/dom';

export const blank = /\s(?:$|\s|\\\n)/y;
export const category = /(\s)|(\p{ASCII})|(.)/yu;
export const nonWhitespace = /[\S\r\n]/g;
export const nonAlphanumeric = /[^0-9A-Za-z]/g;
export const ASCII = /[\x00-\x7F（）［］｛｝]/g;

export const text: TextParser = input => {
  const { context } = input;
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
    case '\\':
      switch (source[position + 1]) {
        case undefined:
          return [[]];
        case '\n':
          assert(source[0] !== Command.Escape);
          return [[]];
        default:
          consume(1, context);
          context.position += 1;
          return [[source.slice(position + 1, context.position)]];
      }
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
      const lineend = 0
        || b && i === source.length
        || b && source[i] === '\n'
        || b && source[i] === '\\' && source[i + 1] === '\n';
      i -= position;
      i = lineend ? i : i - +b || 1;
      consume(i - 1, context);
      context.position += i - 1;
      const linestart = position === 0 || source[position - 1] === '\n';
      i = linestart && b && i >= 3 ? i - 3 : 0;
      i += position;
      return i === context.position || b && !linestart || lineend
        ? [[]]
        : [[source.slice(i, context.position)]];
  }
};

export const txt: TxtParser = union([
  text,
]) as TxtParser;

export const linebreak: LinebreakParser = focus(/[\r\n]/y, union([
  text,
])) as LinebreakParser;

export function isAlphanumeric(char: string): boolean {
  assert(char.length === 1);
  if (char < '0' || '\x7F' < char) return false;
  return '0' <= char && char <= '9'
      || 'a' <= char && char <= 'z'
      || 'A' <= char && char <= 'Z';
}

export function isASCII(char: string): boolean {
  assert(char.length === 1);
  return char <= '\x7F'
      || char === '（' || char === '）'
      || char === '［' || char === '］'
      || char === '｛' || char === '｝';
}
