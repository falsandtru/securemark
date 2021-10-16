import { CommentParser } from '../inline';
import { validate, creator, match } from '../../combinator';
import { html } from 'typed-dom';

export const comment: CommentParser = creator(validate('[#', '#]', match(
  /^\[(#+)\s+(\S[^\n]*?(?:\n.*?){0,99}?(?:\s|\n\s*))($|\1\])/,
  ([, , title, closer]) => (rest, { resources }) =>
    closer
      ? [[html('sup', { class: 'comment', title: title.trim().replace(/\x7F.?/gs, '') })], rest]
      : resources && void (resources.budget -= title.match(/\n/g)!.length))));
