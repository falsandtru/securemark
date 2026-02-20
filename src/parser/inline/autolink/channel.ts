import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { union, tails, sequence, some, state, constraint, verify, rewrite, open, convert, fmap, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { emoji } from './hashtag';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

// https://example/@user?ch=a+b must be a user channel page or a redirect page going there.

export const channel: AutolinkParser.ChannelParser = lazy(() => rewrite(
  sequence([
    open(
      /(?<![0-9a-z])@/yi,
      tails([
        str(/[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?(?:\.[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?)*\//yi),
        str(/[a-z][0-9a-z]*(?:[-.][0-9a-z]+)*(?![0-9a-z@]|>>|:\S)/yi),
      ]),
      false,
      [3 | Backtrack.autolink]),
    some(open(
      '#',
      verify(
        str(new RegExp([
          /(?!['_])(?:[^\p{C}\p{S}\p{P}\s]|emoji|'(?=[0-9A-Za-z])|_(?=[^'\p{C}\p{S}\p{P}\s]|emoji))+(?![0-9a-z@]|>>|:\S|[^\p{C}\p{S}\p{P}\s]|emoji)/yu.source,
        ].join('').replace(/emoji/g, emoji), 'yu')),
        ([source]) => !/^[0-9]{1,4}$|^[0-9]{5}/.test(source)),
      false,
      [3 | Backtrack.autolink])),
  ]),
  union([
    constraint(State.autolink, state(State.autolink, fmap(convert(
      source =>
        `[${source}]{ ${
          source.includes('/')
            ? `https://${source.slice(1, source.indexOf('#')).replace('/', '/@')}`
            : `/${source.slice(0, source.indexOf('#'))}`
        } }`,
      unsafelink,
      false),
      ([el], { source, position, range = 0 }) => {
        const src = source.slice(position - range, position);
        const url = `${el.getAttribute('href')}?ch=${src.slice(src.indexOf('#') + 1).replace(/#/g, '+')}`;
        return [define(el, { class: 'channel', href: url }, src)];
      }))),
    ({ context: { source } }) => [[source]],
  ])));
