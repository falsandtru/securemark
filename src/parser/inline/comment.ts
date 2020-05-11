import { CommentParser } from '../inline';
import { validate, creator, match } from '../../combinator';
import { html } from 'typed-dom';

export const comment: CommentParser = creator(validate('<#', match(
  /^<(#+)\s+((?:(?!\1>)\S+\s+)+)(\1>)?/,
  ([whole, , title, closer]) => (rest, { resources }) =>
    closer
      ? [[html('sup', { class: 'comment', title: title.trim() })], rest]
      : resources && void (resources.creation -= whole.match(/<#+\s/g)!.length))));
