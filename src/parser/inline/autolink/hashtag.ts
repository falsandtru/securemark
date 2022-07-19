import { AutolinkParser } from '../../inline';
import { union, tails, constraint, verify, rewrite, open, convert, fmap, lazy } from '../../../combinator';
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
    tails([
      verify(
        str(/^[0-9A-Za-z](?:(?:[0-9A-Za-z]|-(?=\w)){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-(?=\w)){0,61}[0-9A-Za-z])?)*\//),
        ([source]) => source.length <= 253 + 1),
      verify(
        str(new RegExp([
          /^(?=[0-9]{0,127}_?(?:[^\d\p{C}\p{S}\p{P}\s]|emoji))/u.source,
          /(?:[^\p{C}\p{S}\p{P}\s]|emoji|_(?=[^\p{C}\p{S}\p{P}\s]|emoji)){1,128}/u.source,
          /(?!_?(?:[^\p{C}\p{S}\p{P}\s]|emoji)|')/u.source,
        ].join('').replace(/emoji/g, emoji), 'u')),
        ([source]) => source.length <= 128),
    ]))),
  convert(
    source =>
      `[${source}]{ ${
      source.includes('/')
        ? `https://${source.slice(1).replace('/', '/hashtags/')}`
        : `/hashtags/${source.slice(1)}`
      } }`,
    union([unsafelink]))),
  ([el]) => [define(el, { class: 'hashtag' }, el.innerText)]));
