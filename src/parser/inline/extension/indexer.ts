import { ExtensionParser } from '../../inline';
import { union, line, surround, lazy, fmap } from '../../../combinator';
import { index } from './index';
import { html } from 'typed-dom';

export const indexer: ExtensionParser.IndexerParser = lazy(() => line(fmap(
  surround(
    /^\s+(?=\[#)/,
    union([index]),
    /^(?=\s*$)/),
  ([el]) =>
    [html('span', { class: 'indexer', 'data-index': el.getAttribute('href')!.slice(el.hash.indexOf(':') + 1) })])));
