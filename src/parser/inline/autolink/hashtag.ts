import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { List, Node } from '../../../combinator/parser';
import { state, constraint, backtrack, verify, surround, lazy } from '../../../combinator';
import { parse } from '../link';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

// https://example/hashtags/a must be a hashtag page or a redirect page going there.

// https://github.com/tc39/proposal-regexp-unicode-property-escapes#matching-emoji
export const emoji = /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\u200D/u;

export const hashtag: AutolinkParser.HashtagParser = lazy(() => constraint(State.autolink, state(State.autolink,
  backtrack(surround(
    new RegExp([
      /(?<![^\p{C}\p{S}\p{P}\s]|emoji|[@#])#/yu.source,
    ].join('|').replace(/emoji/g, emoji.source), 'yu'),
    verify(
      str(new RegExp([
        /(?!['_])(?:[^\p{C}\p{S}\p{P}\s]|emoji|'(?=[0-9A-Za-z])|_(?=[^\p{C}\p{S}\p{P}\s]|emoji))+/yu.source,
      ].join('|').replace(/emoji/g, emoji.source), 'yu')),
      (_, output) => /^[0-9]{0,4}[^0-9]/.test(output.peek().head!.value)),
    new RegExp([
      /(?![_.-]?[0-9a-z@#]|>>|:\S|[^\p{C}\p{S}\p{P}\s]|emoji)/yu.source,
    ].join('|').replace(/emoji/g, emoji.source), 'yu'),
    false,
    [3 | Backtrack.unescapable],
    ([, [{ value }]], input, output) =>
      output.append(
        new Node(define(parse(
          new List([new Node(`#${value}`)]),
          new List([new Node(`/hashtags/${value}`)]),
          input),
          { class: 'hashtag' }))))))));
