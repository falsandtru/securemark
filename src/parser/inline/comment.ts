import { CommentParser } from '../inline';
import { Ctx, validate, creator, match } from '../../combinator';
import { html } from 'typed-dom';
import { DeepMutable } from 'spica/type';

export const comment: CommentParser = creator(validate('<#', match(
  /^<(#+)\s+(\S+(?:\s+(?!\1)\S+)*)(\s+\1>)?/,
  ([whole, , title, last]) => (rest, { resource }: DeepMutable<Ctx>) =>
    last
      ? [[html('sup', { class: 'comment', title })], rest]
      : resource && void (resource.creation -= whole.match(/<#+\s/g)!.length))));
