import { HTMLEntityParser } from '../inline';
import { validate } from '../source/validation';

const syntax = /^&(?:[0-9a-z]+|#[0-9]{1,8}|#x[0-9a-f]{1,8});/i;

export const htmlentity: HTMLEntityParser = function (source: string): [[Text], string] | undefined {
  if (!validate(source, '&')) return;
  const [whole] = source.match(syntax) || [''];
  if (!whole) return;
  return [[document.createTextNode(parse(whole))], source.slice(whole.length)];
};

const parser = document.createElement('span');
function parse(str: string): string {
  parser.innerHTML = str;
  return parser.textContent!;
}
