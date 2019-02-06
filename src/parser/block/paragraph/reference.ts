import { ParagraphParser } from '../../block';
import { union, some, line, match, eval } from '../../../combinator';
import '../../source/unescapable';
import { inline } from '../../inline';
import { html } from 'typed-dom';

export const reference: ParagraphParser.ReferenceParser = line(union([
  match(
    /^(>+)[a-zA-Z0-9](?:(?!\s)[\x00-\x7F])*\s*$/,
    ([ref, { length: level }]) => rest =>
      [[html('a', { class: 'reference', rel: 'noopener', 'data-level': `${level}` }, ref.trim()), html('br')], rest]),
  match(
    /^(>+)(?!>)\S.*$/,
    () => () =>
      [[html('span', { class: 'invalid', 'data-invalid-syntax': 'reference', 'data-invalid-type': 'syntax' }, eval(some(inline)(`Invalid syntax: Reference: Use ASCII characters in reference syntax.`))), html('br')], '']),
]));
