import { CommentParser } from '../inline';
import { validate, creator, match } from '../../combinator';
import { html } from 'typed-dom';

export const comment: CommentParser = creator(validate('<#', match(
  /^<(#+)\s+(\S+(?:\s+(?!\1)\S+)*)(\s+\1>)?/,
  ([whole, , title, last]) => (rest, { resource }) =>
    last
      ? [[html('sup', { class: 'comment', title })], rest]
      : resource && void (resource.creation -= whole.match(/<#+\s/g)!.length))));
