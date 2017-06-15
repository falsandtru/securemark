import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { BlockquoteParser, consumeBlockEndEmptyLine } from '../block';
import { PlainTextParser, squash } from '../text';
import { plaintext } from '../text/plaintext';

type SubParsers = [PlainTextParser];

const syntax = /^>+(?=[ \n]|$)/;

export const blockquote: BlockquoteParser = function (source: string): Result<HTMLQuoteElement, SubParsers> {
  let [indent] = source.match(syntax) || [''];
  if (!indent) return;
  const top = document.createElement('blockquote');
  let bottom = indent.split('').slice(1)
    .reduce(p =>
      p.appendChild(document.createElement('blockquote'))
    , top);
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.trim() === '') break;
    const diff = (line.match(syntax) || [indent])[0].length - indent.length;
    if (diff > 0) {
      bottom = line.slice(0, diff).split('')
        .reduce(p =>
          p.appendChild(document.createElement('blockquote'))
        , bottom);
    }
    if (diff < 0) {
      bottom = line.slice(0, -diff).split('')
        .reduce(p =>
          <HTMLQuoteElement>p.parentElement!
        , bottom);
    }
    assert(indent.length + diff > 0);
    indent = indent[0].repeat(indent.length + diff);
    if (bottom.lastChild && bottom.lastChild !== bottom.lastElementChild) {
      void bottom.appendChild(document.createElement('br'));
    }
    const text = line.split(' ', 1)[0] === indent
      ? line.trim().slice(indent.length + 1).replace(/ /g, String.fromCharCode(160))
      : `>${line}`.trim().slice(1).replace(/ /g, String.fromCharCode(160));
    void bottom.appendChild(squash((loop(combine<SubParsers, Text>([plaintext]))(text) || [[document.createTextNode('')]])[0]));
    if (bottom.childNodes.length === 1 && bottom.firstChild!.textContent!.trim() === '') return;
    source = source.slice(line.length + 1);
  }
  return consumeBlockEndEmptyLine<HTMLQuoteElement, SubParsers>([top], source);
};
