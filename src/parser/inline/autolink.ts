import { AutolinkParser } from '../inline';
import { union, some, syntax, guard, validate, fmap } from '../../combinator';
import { url } from './autolink/url';
import { email } from './autolink/email';
import { channel } from './autolink/channel';
import { account } from './autolink/account';
import { hashtag, emoji } from './autolink/hashtag';
import { hashnum } from './autolink/hashnum';
import { anchor } from './autolink/anchor';
import { str } from '../source';
import { Syntax, State } from '../context';
import { stringify } from '../util';

export const autolink: AutolinkParser = fmap(
  validate(/^(?:[@#>0-9A-Za-z]|\S#)/,
  guard(context => ~context.state! & State.autolink,
  syntax(Syntax.autolink, 1, 1,
  some(union([
    url,
    email,
    // Escape unmatched email-like strings.
    str(/^[0-9A-Za-z]+(?:[.+_-][0-9A-Za-z]+)*(?:@(?:[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?)+/),
    channel,
    account,
    // Escape unmatched account-like strings.
    str(/^@+[0-9A-Za-z]*(?:-[0-9A-Za-z]+)*/),
    // Escape invalid leading characters.
    str(new RegExp(/^(?:[^\p{C}\p{S}\p{P}\s]|emoji|['_])(?=#)/u.source.replace('emoji', emoji), 'u')),
    hashtag,
    hashnum,
    // Escape unmatched hashtag-like strings.
    str(new RegExp(/^#+(?:[^\p{C}\p{S}\p{P}\s]|emoji|['_])*/u.source.replace('emoji', emoji), 'u')),
    anchor,
  ]))))),
  ns => ns.length === 1 ? ns : [stringify(ns)]);
