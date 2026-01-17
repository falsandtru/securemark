import { ExtensionParser } from '../../inline';
import { union, focus, surround } from '../../../combinator';
import { signature } from './index';
import { html } from 'typed-dom/dom';

export const indexer: ExtensionParser.IndexerParser = surround(
  /^\s+\[(?=\|\S)/,
  union([
    signature,
    focus(/^\|(?=\])/, () => [[html('span', { class: 'indexer', 'data-index': '' })], '']),
  ]),
  /^\]\s*$/);
