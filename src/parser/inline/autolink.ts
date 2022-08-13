import { AutolinkParser } from '../inline';
import { union, some, syntax, constraint, validate, focus, fmap } from '../../combinator';
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
  validate(/^(?:[@#>0-9a-z]|\S[#>])/i,
  constraint(State.autolink, false,
  syntax(Syntax.autolink, 1, 1, ~State.shortcut,
  some(union([
    url,
    email,
    // Escape unmatched email-like strings.
    focus(
      /^[0-9a-z](?:[_.+-](?=[0-9a-z])|[0-9a-z])*(?:@(?:[0-9a-z]+(?:[.-][0-9a-z]+)*)?)*/i,
      ({ source }) => {
        if (source.length > 255 || source.includes('@')) return [[source], ''];
        const i = source.indexOf('_');
        if (i === -1) return [[source], ''];
        return [[source.slice(0, i)], source.slice(i)];
      }),
    channel,
    account,
    // Escape unmatched account-like strings.
    str(/^@+[0-9a-z]*(?:-[0-9a-z]+)*/i),
    // Escape invalid leading characters.
    str(new RegExp(/^(?:[^\p{C}\p{S}\p{P}\s]|emoji)(?=#)/u.source.replace('emoji', emoji), 'u')),
    hashtag,
    hashnum,
    // Escape unmatched hashtag-like strings.
    str(new RegExp(/^#+(?:[^\p{C}\p{S}\p{P}\s]|emoji|')*/u.source.replace('emoji', emoji), 'u')),
    // Escape invalid leading characters.
    str(/^[0-9\p{Sc}](?=>)/u),
    anchor,
  ]))))),
  ns => ns.length === 1 ? ns : [stringify(ns)]);
