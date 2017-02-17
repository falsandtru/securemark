import { Result } from '../../parser.d';
import { PreTextParser, consumeBlockEndEmptyLine } from '../block';
import { compose } from '../../parser/compose';
import { loop } from '../../parser/loop';
import { PlainTextParser } from '../inline';
import { plaintext } from '../inline/plaintext';
import { squash } from '../inline/text';

type SubParsers = [PlainTextParser];

const syntax = /^```([0-9a-z])?[ \t]*\n/;
const closer = /^```\s*(?:\n|$)/;

export const pretext: PreTextParser = function (source: string): Result<HTMLPreElement, SubParsers> {
  const [whole, lang] = source.match(syntax) || ['', ''];
  if (!whole) return;
  const el = document.createElement('pre');
  if (lang) {
    void el.setAttribute('class', `lang-${lang.toLowerCase()}`);
  }
  source = source.slice(whole.length);
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.match(closer)) break;
    void el.appendChild(squash((loop(compose<SubParsers, Text>([plaintext]))(line + '\n') || [[]])[0]));
    source = source.slice(line.length + 1);
    if (source === '') return;
  }
  if (el.lastChild) {
    el.lastChild!.textContent = el.lastChild.textContent!.slice(0, -1);
  }
  return consumeBlockEndEmptyLine<HTMLPreElement, SubParsers>([el], source.replace(closer, ''));
}
