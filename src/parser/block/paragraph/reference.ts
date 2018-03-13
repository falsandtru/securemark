import { ParagraphParser } from '../../block';
import { build, combine, some, surround, transform } from '../../../combinator';
import { line } from '../../source/line';
import { unescsource } from '../../source/unescapable';
import { text } from '../../util';
import { html } from 'typed-dom';

const syntax = /^(?=>+[^>\s])/;
const closer = /^\s/;
const tail = /^[^\S\n]*(?:\n|$)/;

export const reference: ParagraphParser.ReferenceParser = line(transform(build(() =>
  surround(syntax, some(combine<ParagraphParser.ReferenceParser>([unescsource]), closer), tail)),
  (ts, rest) =>
    [[html('a', { class: 'reference', rel: 'noopener' }, text(ts).trim()), html('br')], rest]));
