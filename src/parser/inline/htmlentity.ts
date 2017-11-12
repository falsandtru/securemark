import { Result } from '../../combinator';
import { HTMLEntityParser } from '../inline';

type SubParsers = [never];

const syntax = /^&(?:[0-9a-z]+|#[0-9]{1,8}|#x[0-9a-f]{1,8});/i;

export const htmlentity: HTMLEntityParser = function (source: string): Result<Text, SubParsers> {
  if (!source.startsWith('&')) return;
  const [whole] = source.match(syntax) || [''];
  if (!whole) return;
  return [[document.createTextNode(parse(whole))], source.slice(whole.length)];
};

const parser = document.createElement('span');
function parse(str: string): string {
  parser.innerHTML = str;
  return parser.textContent!;
}
