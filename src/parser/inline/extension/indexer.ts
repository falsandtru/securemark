import { ExtensionParser } from '../../inline';
import { union, creator, verify, focus, surround, fmap } from '../../../combinator';
import { index } from './index';
import { clean } from '../../util';
import { html } from 'typed-dom/dom';

export const indexer: ExtensionParser.IndexerParser = creator(fmap(verify(surround(
  /^\s+(?=\[#\S)/,
  clean(union([
    focus('[#]', () => [[html('a', { href: '#' })], '']),
    index,
  ])),
  /^\s*$/),
  // Indexer is invisible but invalids must be visible.
  ([el]) => el.getElementsByClassName('invalid').length === 0),
  ([el]) => [
    html('span', { class: 'indexer', 'data-index': el.getAttribute('href')!.slice(7) }),
  ]));
