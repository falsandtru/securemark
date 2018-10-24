import { CommentParser } from '../inline';
import { union, match } from '../../combinator';
import '../source/unescapable';
import { html } from 'typed-dom';

export const comment: CommentParser = union<CommentParser>([
  match(
    /^<(#+)\s+([\s\S]*?\s+)?\1>/,
    ([, , s = ''], rest) => [[html('sup', { class: 'comment', title: s.trim() })], rest]),
  match(
    /^<!-{2,}\s+([\s\S]*?\s+)?-{2,}>/,
    ([, , s = ''], rest) => [[html('sup', { class: 'comment', title: s.trim() })], rest]),
]);
