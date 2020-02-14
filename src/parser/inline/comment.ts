import { CommentParser } from '../inline';
import { validate, creation, backtrack, match } from '../../combinator';
import { html } from 'typed-dom';

export const syntax = /^<(#+)\s+(\S+(?:\s+(?!\1)\S+)*)\s+\1>/;

export const comment: CommentParser = creation(validate('<#', backtrack(match(
  syntax,
  ([, , title]) => rest =>
    [[html('sup', { class: 'comment', title })], rest]))));
