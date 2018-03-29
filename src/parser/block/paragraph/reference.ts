import { ParagraphParser } from '../../block';
import { combine, some, surround, transform, trim } from '../../../combinator';
import { line } from '../../source/line';
import { unescsource } from '../../source/unescapable';
import { compress } from '../../util';
import { html } from 'typed-dom';

const syntax = /^(?=>+[^>\s])/;

export const reference: ParagraphParser.ReferenceParser = line(transform(
  surround(syntax, compress(trim(some(combine<ParagraphParser.ReferenceParser>([unescsource]), /^\s/))), /^[^\S\n]*(?:\n|$)/),
  (ts, rest) =>
    [[html('a', { class: 'reference', rel: 'noopener' }, ts), html('br')], rest]));
