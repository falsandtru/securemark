import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { PreTextParser, consumeBlockEndEmptyLine } from '../block';
import { PlainTextParser, squash } from '../text';
import { plaintext } from '../text/plaintext';

type SubParsers = [PlainTextParser];

const syntax = /^(`{3,})([a-z]*)(?:[^\S\n]+([0-9a-zA-Z_\-.]+))?[^\S\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?=\n|$)/;

export const pretext: PreTextParser = function (source: string): Result<HTMLPreElement, SubParsers> {
  if (!source.startsWith('```')) return;
  const [whole, keyword, lang, filename = ''] = source.match(syntax) || ['', '', ''];
  if (!whole) return;
  const el = document.createElement('pre');
  if (lang) {
    void el.setAttribute('class', `language-${lang.toLowerCase()}`);
    void el.setAttribute('data-lang', `${lang.toLowerCase()}`);
  }
  if (filename) {
    void el.setAttribute('data-file', filename);
  }
  const [[, ...cs], rest] = loop(combine<SubParsers, Text>([plaintext]), `^\n${keyword}[^\\S\n]*(?=\n|$)`)(`\n${source.slice(source.indexOf('\n') + 1)}`) || [[], ''];
  if (!rest.startsWith(`\n${keyword}`)) return;
  void el.appendChild(squash(cs));
  return consumeBlockEndEmptyLine<HTMLPreElement, SubParsers>([el], source.slice(source.length - rest.length + 1 + keyword.length + 1));
};
