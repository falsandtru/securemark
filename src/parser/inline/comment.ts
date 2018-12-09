import { CommentParser } from '../inline';
import { match, verify } from '../../combinator';
import '../source/unescapable';
import { html } from 'typed-dom';

export const comment: CommentParser = verify(
  match(
    /^<(#+)\s+([\s\S]*?\s+)?\1>/,
    ([, , s = ''], rest) => [[html('sup', { class: 'comment', title: s.trim() })], rest]),
  ([el]) => el.title.trim() !== '');
