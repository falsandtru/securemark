import { Markdown } from '../../../../markdown.d';
import { Parser, Result } from '../../../parser';
import { PreTextParser, consumeBlockEndEmptyLine } from '../../block';
import { loop } from '../../../combinator/loop';
import { inline } from '../../inline';
import { squash } from '../../inline/text';

export interface PlaceholderParser extends
  Markdown<'extension' & 'placeholder'>,
  Parser<HTMLElement, SubParsers> {
}
type SubParsers = [PreTextParser];

const syntax = /^(~{3,})(\S*?)\s*?\n(?:[^\n]*\n)*?\1/;
const cache = new Map<string, RegExp>();

export const placeholder: PlaceholderParser = function (source: string): Result<HTMLElement, SubParsers> {
  const [whole, keyword] = source.match(syntax) || ['', ''];
  if (!whole) return;
  const message = document.createElement('p');
  void message.appendChild(squash(loop(inline)("**WARNING: DON'T USE `~~~` SYNTAX!!**\\\nThis *extension syntax* is reserved for extensibility.")![0]));
  source = source.slice(source.indexOf('\n') + 1);
  if (!cache.has(keyword)) {
    void cache.set(keyword, new RegExp(`^${keyword}\s*(?:\n|$)`));
  }
  const lines: string[] = [];
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.match(cache.get(keyword)!)) break;
    void lines.push(line + '\n');
    source = source.slice(line.length + 1);
    if (source === '') return;
  }
  const quote = document.createElement('pre');
  void quote.appendChild(document.createTextNode(`${keyword}\n${lines.join('')}${keyword}`));
  return consumeBlockEndEmptyLine<HTMLElement, SubParsers>([message, quote], source.slice(keyword.length + 1));
};
