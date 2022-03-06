import { CommentParser } from '../inline';
import { union, some, validate, creator, match } from '../../combinator';
import { eval } from '../../combinator/data/parser';
import { unsafehtmlentity } from './htmlentity';
import { unescsource } from '../source';
import { html } from 'typed-dom';

export const comment: CommentParser = creator(validate('[#', match(
  /^\[(#+)(?!\S|\s+\1\]|\s*\[\1(?:$|\s))((?:\s+\S+)+?)(?:\s+(\1\])|\s*(?=\[\1(?:$|\s)))/,
  ([whole, , body, closer]) => (rest, context) => {
    [whole, body] = `${whole}\0${body.trimStart()}`.replace(/\x1B/g, '').split('\0', 2);
    if (!closer) return [[html('sup', {
      class: 'comment invalid',
      'data-invalid-syntax': 'comment',
      'data-invalid-type': 'content',
      'data-invalid-description': 'Comment syntax using the same level cannot start in another comment syntax.',
    }, whole)], rest];
    const title = eval(some(text)(body, context), []).join('').trim();
    if (title.includes('\0')) return [[html('sup', {
      class: 'comment invalid',
      'data-invalid-syntax': 'comment',
      'data-invalid-type': 'content',
      'data-invalid-description': `Invalid HTML entitiy "${title.match(/\0&[0-9A-Za-z]+;/)![0].slice(1)}".`,
    }, whole)], rest];
    return [[html('sup', { class: 'comment', title })], rest];
  })));

const text: CommentParser.TextParser = union([
  unsafehtmlentity,
  unescsource,
]);
