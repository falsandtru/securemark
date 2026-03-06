import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { List, Data } from '../../../combinator/data/parser';
import { some, state, constraint, verify, surround, lazy } from '../../../combinator';
import { parse } from '../link';
import { emoji } from './hashtag';
import { str } from '../../source';
import { define } from 'typed-dom/dom';

// https://example/@user must be a user page or a redirect page going there.
// https://example/@user?ch=a+b must be a user channel page or a redirect page going there.

export const account: AutolinkParser.AccountParser = lazy(() => constraint(State.autolink, state(State.autolink,
  surround(
    surround(
      /(?<![0-9a-z])@/yi,
      str(/[0-9a-z](?:[.-](?=[0-9a-z])|[0-9a-z]){0,254}\/|/yi),
      str(/[a-z][0-9a-z]*(?:[-.][0-9a-z]+)*(?![-.]?[0-9a-z@]|>>|:\S)/yi),
      false,
      [3 | Backtrack.autolink]),
    some(surround(
      '#',
      verify(
        str(new RegExp([
          /(?!['_])(?:[^\p{C}\p{S}\p{P}\s]|emoji|'(?=[0-9A-Za-z])|_(?=[^\p{C}\p{S}\p{P}\s]|emoji))+/yu.source,
        ].join('|').replace(/emoji/g, emoji.source), 'yu')),
        ([{ value }]) => /^[0-9]{0,4}[^0-9]/.test(value)),
      new RegExp([
        /(?![0-9a-z@]|>>|:\S|[^\p{C}\p{S}\p{P}\s]|emoji)/yu.source,
      ].join('|').replace(/emoji/g, emoji.source), 'yu'),
      false,
      [3 | Backtrack.autolink])),
    '',
    false, [],
    ([[{ value: host }, { value: account }], nodes], context) => {
      const hashes = nodes.foldl((acc, { value }) => acc + '#' + value, '');
      const param = nodes.foldl((acc, { value }) => acc ? acc + '+' + value : value, '');
      return new List([
        new Data(define(
          parse(
            new List([new Data(`@${host}${account}${hashes}`)]),
            new List([new Data(host ? `https://${host}@${account}?ch=${param}` : `/@${account}?ch=${param}`)]),
            context),
          { class: 'channel' }))
      ]);
    },
    ([[{ value: host }, { value: account }]], context) => {
      if (context.source[context.position] === '#') return;
      return new List([
        new Data(define(
          parse(
            new List([new Data(`@${host}${account}`)]),
            new List([new Data(host ? `https://${host}@${account}` : `/@${account}`)]),
            context),
          { class: 'account' }))
      ]);
    }))));
