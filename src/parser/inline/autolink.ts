import { AutolinkParser } from '../inline';
import { union, some, focus, fmap } from '../../combinator';
import { uri } from './autolink/uri';
import { email } from './autolink/email';
import { channel } from './autolink/channel';
import { account } from './autolink/account';
import { hashtag } from './autolink/hashtag';
import { hashref } from './autolink/hashref';
import { unescsource } from '../source/unescapable';
import { stringify } from '../util';
import { text } from 'typed-dom';

export const autolink: AutolinkParser = fmap(
  some(union([
    uri,
    email,
    focus(/^[a-zA-Z0-9]+(?:[.+_-][a-zA-Z0-9]+)*(?:@(?:[a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*)?)+/, some(unescsource)),
    focus(/^[@#]+(?![0-9a-zA-Z]|[^\x00-\x7F\s])/, some(unescsource)),
    channel,
    account,
    hashtag,
    hashref,
    focus(/^(?:[a-zA-Z0-9]|[^\x00-\x7F\s])(?=#)/, some(unescsource)),
  ])),
  ns =>
    ns.length === 1
      ? ns
      : [text(stringify(ns))]);
