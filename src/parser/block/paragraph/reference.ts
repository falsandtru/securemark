import { ParagraphParser } from '../../block';
import { combine, some, surround, transform } from '../../../combinator';
import { line } from '../../source/line';
import { unescsource } from '../../source/unescapable';
import { html } from 'typed-dom';

const syntax = /^(?=>+[^>\s])/;
const closer = /^\s/;
const tail = /^[^\S\n]*(?:\n|$)/;

export const reference: ParagraphParser.ReferenceParser = line(source =>
  transform(
    surround(syntax, some(combine<ParagraphParser.ReferenceParser>([unescsource]), closer), tail),
    (ts, rest) =>
      [[html('a', { class: 'reference', rel: 'noopener' }, ts.reduce((acc, t) => acc + t.textContent, '').trim()), html('br')], rest])
    (source));
