import { AutolinkParser } from '../inline';
import { State } from '../context';
import { union, some, state, validate, lazy, fmap } from '../../combinator';
import { url, lineurl } from './autolink/url';
import { email } from './autolink/email';
import { channel } from './autolink/channel';
import { account } from './autolink/account';
import { hashtag, emoji } from './autolink/hashtag';
import { hashnum } from './autolink/hashnum';
import { anchor } from './autolink/anchor';
import { str } from '../source';
import { stringify } from '../util';

export const autolink: AutolinkParser = lazy(() =>
  validate(/(?:[@#>0-9a-z]|\S#|[0-9a-z]>|[\r\n]!?https?:\/\/)/yiu,
  state(~State.autolink,
  union([
    some(union([lineurl])),
    fmap(some(union([
      url,
      email,
      // Escape unmatched email-like strings.
      str(/[0-9a-z]+(?:[_.+-][0-9a-z]+|@(?=@))*/yi),
      channel,
      account,
      // Escape unmatched account-like strings.
      str(/@+(?:[0-9a-z]+(?:[_.+-][0-9a-z]+)*)?/yi),
      // Escape invalid leading characters.
      str(new RegExp(/(?:[^\p{C}\p{S}\p{P}\s]|emoji)(?=#)/yu.source.replace('emoji', emoji), 'yu')),
      hashtag,
      hashnum,
      // Escape unmatched hashtag-like strings.
      str(new RegExp(/#+(?:(?:[^\p{C}\p{S}\p{P}\s]|emoji)+(?:['_.+-](?:[^\p{C}\p{S}\p{P}\s]|emoji)+)*)?/yu.source.replace(/emoji/g, emoji), 'yu')),
      // Escape invalid leading characters.
      str(/[0-9a-z](?=>)/yiu),
      anchor,
    ])),
    ns => ns.length === 1 ? ns : [stringify(ns)]),
  ]))));
