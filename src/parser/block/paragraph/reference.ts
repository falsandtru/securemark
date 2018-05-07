import { ParagraphParser } from '../../block';
import { capture, trim } from '../../../combinator';
import { line } from '../../source/line';
import { html } from 'typed-dom';

export const reference: ParagraphParser.ReferenceParser = line(trim(capture(
  /^(>+)[^>\s]\S*$/i,
  ([ref, { length: level }], rest) =>
    [[html('a', { class: 'reference', rel: 'noopener', 'data-level': `${level}` }, ref), html('br')], rest])
), true, true);
