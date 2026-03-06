import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { List, Data } from '../../../combinator/data/parser';
import { union, state, constraint, verify, rewrite, surround, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

// https://example/hashtags/a must be a hashtag page or a redirect page going there.

// https://github.com/tc39/proposal-regexp-unicode-property-escapes#matching-emoji
export const emoji = /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\u200D/u;

export const hashtag: AutolinkParser.HashtagParser = lazy(() => rewrite(
  surround(
    new RegExp([
      /(?<![^\p{C}\p{S}\p{P}\s]|emoji)#/yu.source,
    ].join('|').replace(/emoji/g, emoji.source), 'yu'),
    verify(
      str(new RegExp([
        /(?!['_])(?:[^\p{C}\p{S}\p{P}\s]|emoji|'(?=[0-9A-Za-z])|_(?=[^\p{C}\p{S}\p{P}\s]|emoji))+/yu.source,
      ].join('|').replace(/emoji/g, emoji.source), 'yu')),
      ([{ value }]) => /^[0-9]{0,4}[^0-9]/.test(value)),
    new RegExp([
      /(?![0-9a-z@#]|>>|:\S|[^\p{C}\p{S}\p{P}\s]|emoji)/yu.source,
    ].join('|').replace(/emoji/g, emoji.source), 'yu'),
    false,
    [3 | Backtrack.autolink]),
  constraint(State.autolink, state(State.autolink, fmap(convert(
    source => `[${source}]{ ${`/hashtags/${source.slice(1)}`} }`,
    union([unsafelink]),
    false),
    ([{ value }]) => new List([new Data(define(value, { class: 'hashtag' }))]))))));
