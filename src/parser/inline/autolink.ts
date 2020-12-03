import { AutolinkParser } from '../inline';
import { union, some, validate, guard, fmap } from '../../combinator';
import { stringify } from '../util';
import { url } from './autolink/url';
import { email } from './autolink/email';
import { channel } from './autolink/channel';
import { account } from './autolink/account';
import { hashtag } from './autolink/hashtag';
import { hashref } from './autolink/hashref';
import { address } from './autolink/address';
import { str } from '../source';

export const autolink: AutolinkParser = fmap(
  validate(/^(?:[@#>0-9A-Za-z]|[^\x00-\x7F\s]#)/,
  guard(context => context.syntax?.inline?.autolink ?? true,
  some(union([
    url,
    email,
    // Escape unmatched email-like strings.
    str(/^[0-9A-Za-z]+(?:[.+_-][0-9A-Za-z]+)*(?:@(?:[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?)+/),
    // Escape repeated symbols.
    str(/^[@#]+(?![0-9A-Za-z]|[^\x00-\x7F\s])/),
    channel,
    account,
    // Escape unmatched account-like strings.
    str(/^@[0-9A-Za-z]+(?:-[0-9A-Za-z]+)*/),
    // Escape invalid leading characters.
    str(/^[0-9A-Za-z]+(?=#)|^[^\x00-\x7F\s](?=#)/),
    hashtag,
    hashref,
    // Escape unmatched hashtag-like strings.
    str(/^#(?:[0-9A-Za-z]|[^\x00-\x7F\s])+/),
    address,
  ])))),
  ns => ns.length === 1 ? ns : [stringify(ns)]);
