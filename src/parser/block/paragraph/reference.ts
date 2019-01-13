import { ParagraphParser } from '../../block';
import { union, some, line, match, eval } from '../../../combinator';
import '../../source/unescapable';
import { inline } from '../../inline';
import { html } from 'typed-dom';

export const reference: ParagraphParser.ReferenceParser = line(
  union([
    match(
      /^(>+)[0-9a-z]+\s*$/,
      ([ref, { length: level }]) => rest =>
        [[html('a', { class: 'reference', rel: 'noopener', 'data-level': `${level}` }, ref.trim()), html('br')], rest]),
    match(
      /^(>+)(?!>)\S.*$/,
      () => () =>
        [[html('span', { class: 'invalid', 'data-invalid-syntax': 'reference', 'data-invalid-type': 'syntax' }, eval(some(inline)(`Invalid syntax: Reference: Use lower-case alphanumeric characters in reference syntax.`))), html('br')], '']),
  ]));
