import { ExtensionParser } from '../../inline';
import { union, open, when } from '../../../combinator';
import { index } from './index';
import { str } from '../../source';
import { html } from 'typed-dom';

export const indexer: ExtensionParser.IndexerParser = when(open(
  str(/^\s+(?=\[#)/),
  union([index])),
  (ns, rest): ns is [never, HTMLAnchorElement] => ns.length === 2 && rest.trim() === '',
  ([, el]) => [
    [html('span', { class: 'indexer', 'data-index': el.getAttribute('href')!.slice(el.hash.indexOf(':') + 1) })],
    ''
  ]);
