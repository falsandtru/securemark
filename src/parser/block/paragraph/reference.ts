import { ParagraphParser } from '../../block';
import { union, some, surround, transform, trim } from '../../../combinator';
import { line } from '../../source/line';
import { unescsource } from '../../source/unescapable';
import { compress } from '../../util';
import { html } from 'typed-dom';

export const reference: ParagraphParser.ReferenceParser = line(
  transform<ParagraphParser.ReferenceParser>(
    surround(/^(?=>+[^>\s])/, compress(trim(some(union([unescsource]), /^\s/))), /^[^\S\n]*(?:\n|$)/),
    (ts, rest) =>
      [[html('a', { class: 'reference', rel: 'noopener' }, ts), html('br')], rest]));
