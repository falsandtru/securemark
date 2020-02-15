import { CommentParser } from '../inline';
import { validate, creator, backtracker, match } from '../../combinator';
import { html } from 'typed-dom';

export const syntax = /^<(#+)\s+(\S+(?:\s+(?!\1)\S+)*)\s+\1>/;

export const comment: CommentParser = creator(validate('<#', backtracker(match(
  syntax,
  ([, , title]) => rest =>
    [[html('sup', { class: 'comment', title })], rest]))));
