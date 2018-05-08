import { HTMLEntityParser } from '../inline';
import { match } from '../../combinator';
import '../source/unescapable';
import { html, text } from 'typed-dom';

export const htmlentity: HTMLEntityParser = match(
  /^&(?:[0-9a-z]+|#[0-9]{1,8}|#x[0-9a-f]{1,8});/i,
  ([entity], rest) =>
    [[text(parse(entity))], rest]);

const parser = html('span');
function parse(str: string): string {
  parser.innerHTML = str;
  return parser.textContent!;
}
