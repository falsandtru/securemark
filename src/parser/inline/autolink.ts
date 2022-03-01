import { AutolinkParser } from '../inline';
import { union, some, validate, guard, fmap } from '../../combinator';
import { url } from './autolink/url';
import { email } from './autolink/email';
import { channel } from './autolink/channel';
import { account } from './autolink/account';
import { hashtag } from './autolink/hashtag';
import { hashnum } from './autolink/hashnum';
import { anchor } from './autolink/anchor';
import { str } from '../source';
import { stringify } from '../util';

export const autolink: AutolinkParser = fmap(
  validate(/^(?:[@#>0-9A-Za-z]|\S#)/,
  guard(context => context.syntax?.inline?.autolink ?? true,
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
    str(/^(?:[^\p{C}\p{S}\p{P}\s]|['_])(?=#)/u),
    hashtag,
    hashnum,
    // Escape unmatched hashtag-like strings.
    str(/^#+(?:[^\p{C}\p{S}\p{P}\s]|['_])*/u),
    anchor,
  ])))),
  ns => ns.length === 1 ? ns : [stringify(ns)]);
