import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { PreTextParser, consumeBlockEndEmptyLine } from '../block';
import { PlainTextParser, squash } from '../text';
import { plaintext } from '../text/plaintext';

type SubParsers = [PlainTextParser];

const syntax = /^(`{3,})([a-z]*)(?:\s+([0-9a-zA-Z_\-.]+))?\s*$/;

export const pretext: PreTextParser = function (source: string): Result<HTMLPreElement, SubParsers> {
  if (!source.startsWith('```')) return;
  const [whole, keyword, lang, filename = ''] = source.split('\n', 1).shift()!.match(syntax) || ['', '', ''];
  if (!whole) return;
  if (source.slice(whole.length + 1).search(`\n${keyword}\s*(?:\n|$)`) === -1) return;
  const el = document.createElement('pre');
  if (lang) {
    void el.setAttribute('class', `language-${lang.toLowerCase()}`);
    void el.setAttribute('data-lang', `${lang.toLowerCase()}`);
  }
  if (filename) {
    void el.setAttribute('data-file', filename);
  }
  const closer = `^\n${keyword}\s*(?:\n|$)`;
  const [[, ...cs], rest] = loop(combine<SubParsers, Text>([plaintext]), closer)(`\n${source.slice(source.indexOf('\n') + 1)}`) || [[], ''];
  if (rest.search(closer) !== 0) return;
  void el.appendChild(squash(cs));
  return consumeBlockEndEmptyLine<HTMLPreElement, SubParsers>([el], source.slice(source.length - rest.length + 1 + keyword.length + 1));
};
