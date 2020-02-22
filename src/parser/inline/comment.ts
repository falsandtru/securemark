import { CommentParser } from '../inline';
import { Ctx, validate, creator, match } from '../../combinator';
import { html } from 'typed-dom';
import { DeepMutable } from 'spica/type';

export const comment: CommentParser = creator(validate('<#', match(
  /^<(#+)\s+(\S+(?:\s+(?!\1)\S+)*)(\s+\1>)?/,
  ([whole, , title, last]) => (rest, context: DeepMutable<Ctx>) =>
    last
      ? [[html('sup', { class: 'comment', title })], rest]
      : context.resource && void (context.resource.creation -= whole.match(/<#+\s/g)!.length))));
