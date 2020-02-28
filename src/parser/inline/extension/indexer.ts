import { ExtensionParser } from '../../inline';
import { union, surround } from '../../../combinator';
import { index } from './index';
import { str } from '../../source';
import { html } from 'typed-dom';
import { unshift } from 'spica/array';

export const indexer: ExtensionParser.IndexerParser = surround(
  str(/^\s+(?=\[#[^\s\]])/),
  union([index]),
  /^\s*$/, false,
  ([, [el]], rest) => [
    [html('span', { class: 'indexer', 'data-index': el.getAttribute('href')!.slice(el.hash.indexOf(':') + 1) })],
    rest
  ],
  ([as, bs], rest) => [unshift<HTMLElement | string>(as, bs), rest]);
