import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { union, state, constraint, verify, rewrite, open, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

// https://example/hashtags/a must be a hashtag page or a redirect page going there.

// https://github.com/tc39/proposal-regexp-unicode-property-escapes#matching-emoji
export const emoji = String.raw`\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F`;

export const hashtag: AutolinkParser.HashtagParser = lazy(() => rewrite(
  open(
    new RegExp([
      /(?<![^\p{C}\p{S}\p{P}\s]|emoji)#/yiu.source,
    ].join('').replace(/emoji/g, emoji), 'yu'),
    verify(
      str(new RegExp([
        /(?!['_])(?:[^\p{C}\p{S}\p{P}\s]|emoji|'(?=[0-9A-Za-z])|_(?=[^'\p{C}\p{S}\p{P}\s]|emoji))+(?![0-9a-z@#]|>>|:\S|[^\p{C}\p{S}\p{P}\s]|emoji)/yu.source,
      ].join('').replace(/emoji/g, emoji), 'yu')),
      ([source]) => !/^[0-9]{1,4}$|^[0-9]{5}/.test(source)),
    false,
    [3 | Backtrack.autolink]),
  union([
    constraint(State.autolink, state(State.autolink, fmap(convert(
      source => `[${source}]{ ${`/hashtags/${source.slice(1)}`} }`,
      unsafelink,
      false),
      ([el]) => [define(el, { class: 'hashtag' })]))),
    ({ context: { source } }) => [[source]],
  ])));
