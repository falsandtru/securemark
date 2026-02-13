import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { union, state, constraint, rewrite, open, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

// https://example/hashtags/a must be a hashtag page or a redirect page going there.

// https://github.com/tc39/proposal-regexp-unicode-property-escapes#matching-emoji
export const emoji = String.raw`\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F`;

export const hashtag: AutolinkParser.HashtagParser = lazy(() => rewrite(
  open(
    '#',
    str(new RegExp([
      /^(?!['_])(?=(?:[0-9]{1,9})?(?:[^\d\p{C}\p{S}\p{P}\s]|emoji|'(?=[0-9A-Za-z])|_(?=[^'\p{C}\p{S}\p{P}\s]|emoji)))/u.source,
      /(?:[^\p{C}\p{S}\p{P}\s]|emoji|'(?=[0-9A-Za-z])|_(?=[^'\p{C}\p{S}\p{P}\s]|emoji))+/u.source,
    ].join('').replace(/emoji/g, emoji), 'u')),
    false,
    [3 | Backtrack.autolink]),
  union([
    constraint(State.autolink, state(State.autolink, fmap(convert(
      source => `[${source}]{ ${`/hashtags/${source.slice(1)}`} }`,
      unsafelink,
      false),
      ([el]) => [define(el, { class: 'hashtag' })]))),
    ({ source }) => [[source], ''],
  ])));
