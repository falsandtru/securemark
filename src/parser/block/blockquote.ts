import { Result } from '../../parser';
import { BlockquoteParser, consumeBlockEndEmptyLine } from '../block';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { PlainTextParser } from '../inline';
import { plaintext } from '../inline/plaintext';
import { squash } from '../inline/text';

type SubParsers = [BlockquoteParser, PlainTextParser];

const syntax = /^>+/;

export const blockquote: BlockquoteParser = function (source: string): Result<HTMLQuoteElement, SubParsers> {
  let [indent] = source.match(syntax) || [''];
  if (!indent) return;
  const top = document.createElement('blockquote');
  let bottom = indent.split('').slice(1)
    .reduce(p =>
      <HTMLQuoteElement>p.appendChild(document.createElement('blockquote')), top);
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.trim() === '') break;
    const diff = (line.match(syntax) || [indent])[0].length - indent.length;
    if (diff > 0) {
      bottom = line.slice(0, diff).split('')
        .reduce(p =>
          <HTMLQuoteElement>p.appendChild(document.createElement('blockquote')), bottom);
    }
    if (diff < 0) {
      bottom = line.slice(0, -diff).split('')
        .reduce(p =>
          <HTMLQuoteElement>p.parentElement!, bottom);
    }
    if (bottom.lastChild && bottom.lastChild !== bottom.lastElementChild) {
      void bottom.appendChild(document.createElement('br'));
    }
    void bottom.appendChild(
      squash((loop(combine<[SubParsers[1]], HTMLElement | Text>([plaintext]))(line[0] === '>' ? line.slice(indent.length + diff).trim() : line.trim()) || [[]])[0]));
    if (!bottom.lastChild || !bottom.lastChild!.textContent) return;
    indent = indent[0].repeat(indent.length + diff);
    source = source.slice(line.length + 1);
  }
  return bottom.childNodes.length === 0
    ? void 0
    : consumeBlockEndEmptyLine<HTMLQuoteElement, SubParsers>([top], source);
}
