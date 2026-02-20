import { AutolinkParser } from '../inline';
import { State } from '../context';
import { union, state, validate, lazy } from '../../combinator';
import { url, lineurl } from './autolink/url';
import { email } from './autolink/email';
import { channel } from './autolink/channel';
import { account } from './autolink/account';
import { hashtag, emoji } from './autolink/hashtag';
import { hashnum } from './autolink/hashnum';
import { anchor } from './autolink/anchor';
import { str } from '../source';

export const autolink: AutolinkParser = lazy(() =>
  validate(new RegExp([
    /(?<![0-9a-z])@/yiu.source,
    /(?<![^\p{C}\p{S}\p{P}\s]|emoji)#/yiu.source,
    /(?<![0-9a-z])>>/yiu.source,
    /(?<![0-9a-z][.+-]?)[0-9a-z]/yiu.source,
    /[\r\n]!?https?:\/\//yiu.source,
  ].join('|').replace(/emoji/g, emoji), 'yiu'),
  state(~State.autolink,
  union([
    lineurl,
    url,
    email,
    // Escape unmatched email-like strings.
    str(/[0-9a-z]+(?:[_.+-][0-9a-z]+@?|@(?=@))*/yi),
    channel,
    account,
    // Escape unmatched account-like strings.
    str(/@+(?:[0-9a-z]+(?:[_.+-][0-9a-z]+)*)?/yi),
    hashtag,
    hashnum,
    // Escape unmatched hashtag-like strings.
    str(new RegExp(/#+(?:(?:[^\p{C}\p{S}\p{P}\s]|emoji)+(?:['_.+-](?:[^\p{C}\p{S}\p{P}\s]|emoji)+)*)?/yu.source.replace(/emoji/g, emoji), 'yu')),
    anchor,
  ]))));
