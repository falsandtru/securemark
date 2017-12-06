import { HTMLEntityParser } from '../inline';
import { match } from '../source/validation';

const syntax = /^&(?:[0-9a-z]+|#[0-9]{1,8}|#x[0-9a-f]{1,8});/i;

export const htmlentity: HTMLEntityParser = (source: string): [[Text], string] | undefined => {
  if (!match(source, '&')) return;
  const [whole = ''] = source.match(syntax) || [];
  if (!whole) return;
  return [[document.createTextNode(parse(whole))], source.slice(whole.length)];
};

const parser = document.createElement('span');
function parse(str: string): string {
  parser.innerHTML = str;
  return parser.textContent!;
}
