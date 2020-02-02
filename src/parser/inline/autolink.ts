import { AutolinkParser } from '../inline';
import { union, some, focus, validate, fmap } from '../../combinator';
import { url } from './autolink/url';
import { email } from './autolink/email';
import { channel } from './autolink/channel';
import { account } from './autolink/account';
import { hashtag } from './autolink/hashtag';
import { hashref } from './autolink/hashref';
import { unescsource } from '../source';
import { stringify } from '../util';
import { text } from 'typed-dom';

export const autolink: AutolinkParser = fmap(validate(
  /^[@#A-Za-z0-9]|^[^\x00-\x7F\s]#/,
  some(union([
    url,
    email,
    focus(/^[A-Za-z0-9]+(?:[.+_-][A-Za-z0-9]+)*(?:@(?:[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*)?)+/, some(unescsource)),
    focus(/^[@#]+(?![0-9A-Za-z]|[^\x00-\x7F\s])/, some(unescsource)),
    channel,
    account,
    hashtag,
    hashref,
    focus(/^(?:[A-Za-z0-9]|[^\x00-\x7F\s])(?=#)/, some(unescsource)),
  ]))),
  ns => ns.length === 1 ? ns : [text(stringify(ns))]);
