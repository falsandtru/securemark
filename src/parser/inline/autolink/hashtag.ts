import { AutolinkParser } from '../../inline';
import { union, constraint, rewrite, open, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { str } from '../../source';
import { State } from '../../context';
import { define } from 'typed-dom/dom';

// https://example/hashtags/a must be a hashtag page or a redirect page going there.

// https://github.com/tc39/proposal-regexp-unicode-property-escapes#matching-emoji
export const emoji = String.raw`\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F`;

export const hashtag: AutolinkParser.HashtagParser = lazy(() => fmap(rewrite(
  constraint(State.shortcut, false,
  open(
    '#',
    str(new RegExp([
      /^(?!['_])(?=(?:[0-9]{1,9})?(?:[^\d\p{C}\p{S}\p{P}\s]|emoji|'|_(?=[^\p{C}\p{S}\p{P}\s]|emoji|')))/u.source,
      /(?:[^\p{C}\p{S}\p{P}\s]|emoji|'|_(?=[^\p{C}\p{S}\p{P}\s]|emoji|'))+/u.source,
    ].join('').replace(/emoji/g, emoji), 'u')))),
  convert(
    source => `[${source}]{ ${`/hashtags/${source.slice(1)}`} }`,
    union([unsafelink]))),
  ([el]) => [define(el, { class: 'hashtag' })]));
