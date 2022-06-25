import { ExtensionParser } from '../../inline';
import { union, creator, state, verify, focus, surround, fmap } from '../../../combinator';
import { index } from './index';
import { State } from '../../context';
import { html } from 'typed-dom/dom';

export const indexer: ExtensionParser.IndexerParser = creator(fmap(verify(surround(
  /^\s+(?=\[#\S)/,
  state(State.index, false,
  union([
    focus('[#]', () => [[html('a', { href: '#' })], '']),
    index,
  ])),
  /^\s*$/),
  // Indexer is invisible but invalids must be visible.
  ([el]) => el.getElementsByClassName('invalid').length === 0),
  ([el]) => [
    html('span', { class: 'indexer', 'data-index': el.getAttribute('href')!.slice(7) }),
  ]));
