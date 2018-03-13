import { HTMLEntityParser } from '../inline';
import { line } from '../source/line';
import { html } from 'typed-dom';

const syntax = /^&(?:[0-9a-z]+|#[0-9]{1,8}|#x[0-9a-f]{1,8});/i;

export const htmlentity: HTMLEntityParser = line(source => {
  const [whole = ''] = source.match(syntax) || [];
  if (!whole) return;
  return [[document.createTextNode(parse(whole))], source.slice(whole.length)];
}, false);

const parser = html('span');
function parse(str: string): string {
  parser.innerHTML = str;
  return parser.textContent!;
}
