import { ParagraphParser } from '../../block';
import { union, capture, validate } from '../../../combinator';
import { line } from '../../source/line';
import { inline } from '../../inline';
import { html } from 'typed-dom';

export const reference: ParagraphParser.ReferenceParser = line(validate(
  /^(>+)[^>\s].*/,
  union<ParagraphParser.ReferenceParser>([
    capture(
      /^(>+)[0-9a-z]+\s*$/,
      ([ref, { length: level }], rest) =>
        [[html('a', { class: 'reference', rel: 'noopener', 'data-level': `${level}` }, ref.trim()), html('br')], rest]),
    () =>
      [[...inline(`**WARNING: USE LOWER-CASE ALPHANUMERIC CHARACTERS IN REFERENCE SYNTAX!!**`)![0], html('br')], ''],
  ])
), true, true);
