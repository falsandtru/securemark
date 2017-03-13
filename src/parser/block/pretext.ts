import { Result } from '../../parser';
import { PreTextParser, consumeBlockEndEmptyLine } from '../block';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { PlainTextParser, squash } from '../inline';
import { plaintext } from '../inline/plaintext';

type SubParsers = [PlainTextParser];

const syntax = /^(`{3,})([0-9a-z]*)\S*\s*?\n(?:[^\n]*\n)*?\1/;

export const pretext: PreTextParser = function (source: string): Result<HTMLPreElement, SubParsers> {
  const [whole, keyword, lang] = source.match(syntax) || ['', '', ''];
  if (!whole) return;
  const el = document.createElement('pre');
  if (lang) {
    void el.setAttribute('class', `lang-${lang.toLowerCase()}`);
  }
  source = source.slice(source.indexOf('\n') + 1);
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.match(`^${keyword}\s*(?:\n|$)`)) break;
    void el.appendChild(squash((loop(combine<SubParsers, Text>([plaintext]))(line + '\n') || [[]])[0]));
    source = source.slice(line.length + 1);
    if (source === '') return;
  }
  if (el.lastChild) {
    el.lastChild!.textContent = el.lastChild.textContent!.slice(0, -1);
  }
  return consumeBlockEndEmptyLine<HTMLPreElement, SubParsers>([el], source.slice(keyword.length + 1));
};
