import { CommentParser } from '../inline';
import { match } from '../../combinator';
import '../source/unescapable';
import { html } from 'typed-dom';

export const comment: CommentParser = match(
  /^<(#+)\s+(\S[\s\S]*?)\s+\1>/,
  ([, , title], rest) => [[html('sup', { class: 'comment', title })], rest]);
