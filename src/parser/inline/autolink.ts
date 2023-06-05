import { AutolinkParser } from '../inline';
import { union, some, syntax, constraint, validate, lazy, fmap } from '../../combinator';
import { url, lineurl } from './autolink/url';
import { email } from './autolink/email';
import { channel } from './autolink/channel';
import { account } from './autolink/account';
import { hashtag, emoji } from './autolink/hashtag';
import { hashnum } from './autolink/hashnum';
import { anchor } from './autolink/anchor';
import { str } from '../source';
import { Syntax, State } from '../context';
import { stringify } from '../util';

export const autolink: AutolinkParser = lazy(() =>
  validate(/^(?:[@#>0-9a-z\r\n]|\S[#>])/iu,
  constraint(State.autolink, false,
  syntax(Syntax.autolink, 1, 1, ~State.shortcut,
  union([
    some(union([lineurl])),
    fmap(some(union([
      url,
      email,
      // Escape unmatched email-like strings.
      str(/^[0-9a-z]+(?:[_.+-][0-9a-z]+)*(?:@(?:[0-9a-z]+(?:[.-][0-9a-z]+)*)?)*/i),
      channel,
      account,
      // Escape unmatched account-like strings.
      str(/^@+[0-9a-z]*(?:-[0-9a-z]+)*/i),
      // Escape invalid leading characters.
      str(new RegExp(/^(?:[^\p{C}\p{S}\p{P}\s]|emoji|['_])(?=#)/u.source.replace('emoji', emoji), 'u')),
      hashtag,
      hashnum,
      // Escape unmatched hashtag-like strings.
      str(new RegExp(/^#+(?:[^\p{C}\p{S}\p{P}\s]|emoji|['_])*/u.source.replace('emoji', emoji), 'u')),
      // Escape invalid leading characters.
      str(/^[0-9\p{Sc}](?=>)/u),
      anchor,
    ])),
    ns => ns.length === 1 ? ns : [stringify(ns)]),
  ])))));
