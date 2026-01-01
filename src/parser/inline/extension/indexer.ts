import { ExtensionParser } from '../../inline';
import { union, creation, focus, surround } from '../../../combinator';
import { signature } from './index';
import { html } from 'typed-dom/dom';

export const indexer: ExtensionParser.IndexerParser = surround(
  /^\s+\[(?=\|\S)/,
  union([
    signature,
    creation(1, false, focus(/^\|(?=\])/, () => [[html('span', { class: 'indexer', 'data-index': '' })], ''])),
  ]),
  /^\]\s*$/);
