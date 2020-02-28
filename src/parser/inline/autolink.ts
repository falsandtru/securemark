import { AutolinkParser } from '../inline';
import { union, some, validate, guard, fmap } from '../../combinator';
import { stringify } from '../util';
import { url } from './autolink/url';
import { email } from './autolink/email';
import { channel } from './autolink/channel';
import { account } from './autolink/account';
import { hashtag } from './autolink/hashtag';
import { hashref } from './autolink/hashref';
import { str } from '../source';

export const autolink: AutolinkParser = fmap(
  guard(context => context.syntax?.inline?.autolink ?? true,
  validate(/^[@#A-Za-z0-9]|^[^\x00-\x7F\s]#/,
  some(union([
    url,
    email,
    str(/^[A-Za-z0-9]+(?:[.+_-][A-Za-z0-9]+)*(?:@(?:[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*)?)+/),
    str(/^[@#]+(?![0-9A-Za-z]|[^\x00-\x7F\s])/),
    channel,
    account,
    hashtag,
    hashref,
    str(/^(?:[A-Za-z0-9]|[^\x00-\x7F\s])(?=#)/),
  ])))),
  ns => ns.length === 1 ? ns : [stringify(ns)]);
