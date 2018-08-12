import { ParagraphParser } from '../../block';
import { union, some, match, validate, line, rewrite, eval } from '../../../combinator';
import { contentline } from '../../source/line';
import '../../source/unescapable';
import { inline } from '../../inline';
import { html } from 'typed-dom';

export const reference: ParagraphParser.ReferenceParser = line(rewrite(contentline, validate(
  /^(>+)[^>\s].*/,
  union<ParagraphParser.ReferenceParser>([
    match(
      /^(>+)[0-9a-z]+\s*$/,
      ([ref, { length: level }], rest) =>
        [[html('a', { class: 'reference', rel: 'noopener', 'data-level': `${level}` }, ref.trim()), html('br')], rest]),
    () =>
      [[html('span', { class: 'invalid' }, eval(some(inline)(`Invalid syntax: Reference syntax: Use lower-case alphanumeric characters in reference syntax.`))), html('br')], ''],
  ]))));
