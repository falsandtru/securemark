import { Result } from '../../parser';
import { PreTextParser, consumeBlockEndEmptyLine } from '../block';
import { compose } from '../../combinator/compose';
import { loop } from '../../combinator/loop';
import { PlainTextParser } from '../inline';
import { plaintext } from '../inline/plaintext';
import { squash } from '../inline/text';

type SubParsers = [PlainTextParser];

const syntax = /^(`{3,})([0-9a-z]+)?[ \t]*\n[\s\S]*?\1/;
const cache = new Map<string, RegExp>();

export const pretext: PreTextParser = function (source: string): Result<HTMLPreElement, SubParsers> {
  const [whole, keyword, lang] = source.match(syntax) || ['', '', ''];
  if (!whole) return;
  const el = document.createElement('pre');
  if (lang) {
    void el.setAttribute('class', `lang-${lang.toLowerCase()}`);
  }
  source = source.slice(source.indexOf('\n') + 1);
  if (!cache.has(keyword)) {
    void cache.set(keyword, new RegExp(`^${keyword}\s*(?:\n|$)`));
  }
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.match(cache.get(keyword)!)) break;
    void el.appendChild(squash((loop(compose<SubParsers, Text>([plaintext]))(line + '\n') || [[]])[0]));
    source = source.slice(line.length + 1);
    if (source === '') return;
  }
  if (el.lastChild) {
    el.lastChild!.textContent = el.lastChild.textContent!.slice(0, -1);
  }
  return consumeBlockEndEmptyLine<HTMLPreElement, SubParsers>([el], source.slice(keyword.length));
}
