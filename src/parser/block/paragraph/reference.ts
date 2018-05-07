import { ParagraphParser } from '../../block';
import { union, some, capture, fmap, trim } from '../../../combinator';
import { line } from '../../source/line';
import { unescsource } from '../../source/unescapable';
import { compress } from '../../util';
import { html } from 'typed-dom';

export const reference: ParagraphParser.ReferenceParser = line(capture(
  /^(?=(>+)[^>\s])/,
  ([, { length: level }], rest) =>
    fmap(
      compress(trim(some(union([unescsource]), /^\s/))),
      ts =>
        [html('a', { class: 'reference', rel: 'noopener', 'data-level': `${level}` }, ts), html('br')])
      (rest)
), true, true);
