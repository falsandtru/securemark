import { CommentParser } from '../inline';
import { validate, creator, match } from '../../combinator';
import { html } from 'typed-dom';
import { memoize } from 'spica/memoize';

const closer = memoize<string, RegExp>(sharps => new RegExp(String.raw`\s${sharps}]`));

export const comment: CommentParser = creator(validate('[#', match(
  /^\[(#+)\s+(?!\s|\1\])(?:(\S[^\n]*?(?:\n.*?){0,99}?\s)\1\])?/,
  ([, sharps, title]) => (rest, { resources }) => {
    if (title) return [[html('sup', {
      class: 'comment',
      title: title.trimEnd().replace(/\x7F.?/gs, ''),
    })], rest];
    assert(rest.trimStart() === rest);
    const i = rest.search(closer(sharps));
    if (i !== -1) return [[html('sup', {
      class: 'comment invalid',
      'data-invalid-syntax': 'comment',
      'data-invalid-type': 'content',
      'data-invalid-description': 'Too many lines.',
    }, rest.slice(0, i).trimEnd().replace(/\x7F.?/gs, ''))], rest.slice(i + sharps.length + 2)];
    resources && (resources.budget -= 10);
  })));
