import { CommentParser } from '../inline';
import { match } from '../../combinator';
import { html } from 'typed-dom';

export const comment: CommentParser = match(
  /^<(#+)\s+(\S+(?:\s+(?!\1)\S+)*)\s+\1>/,
  ([, , title]) => (rest, config) =>
    [[html('sup', { class: 'comment', title })], rest, config]);
