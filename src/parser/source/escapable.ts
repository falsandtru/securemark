import { EscapableSourceParser } from '../source';
import { Result, Node } from '../../combinator/parser';
import { spend } from '../../combinator';
import { Command } from '../context';
import { Flag } from '../node';
import { html } from 'typed-dom/dom';

export const escsource: EscapableSourceParser = (input, output) => {
  const { source, position } = input;
  if (position === source.length) return;
  const char = source[position];
  spend(input, output, 1);
  input.position += 1;
  switch (char) {
    case Command.Escape:
      spend(input, output, 1);
      input.position += 1;
      return output.append(new Node(source.slice(position + 1, position + 2)));
    case '\\':
      switch (source[position + 1]) {
        case undefined:
        case '\r':
        case '\n':
          return output.append(new Node(char));
        default:
          spend(input, output, 1);
          input.position += 1;
          return output.append(new Node(source.slice(position, position + 2)));
      }
    case '\r':
      return Result.succ;
    case '\n':
      input.linebreak ||= source.length - position;
      return output.append(new Node(html('br'), Flag.blank));
    default:
      assert(char !== '\n');
      let i = seek(source, position);
      assert(i > position);
      i -= position;
      spend(input, output, i - 1);
      input.position += i - 1;
      return output.append(new Node(source.slice(position, input.position)));
  }
};

function seek(source: string, position: number): number {
  for (let i = position + 1; i < source.length; ++i) {
    const char = source[i];
    switch (char) {
      case '\\':
      case '$':
      case '"':
      case '`':
      case ':':
      case '[':
      case ']':
      case '(':
      case ')':
      case '{':
      case '}':
      case '\r':
      case '\n':
        return i;
      default:
        continue;
    }
    assert(false);
  }
  return source.length;
}
