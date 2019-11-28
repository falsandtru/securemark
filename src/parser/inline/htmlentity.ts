import { HTMLEntityParser } from '../inline';
import { subline, focus } from '../../combinator';
import { html, text } from 'typed-dom';

export const htmlentity: HTMLEntityParser = subline(focus(
  /^&(?:[0-9a-z]+|#[0-9]{1,8}|#x[0-9a-f]{1,8});/i,
  entity => [[text(parse(entity))], '']));

const parser = html('span');
function parse(str: string): string {
  parser.innerHTML = str;
  return parser.textContent!;
}
