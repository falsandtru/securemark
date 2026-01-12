import { ExtensionParser } from '../../inline';
import { Recursion } from '../../context';
import { union, creation, focus, surround } from '../../../combinator';
import { signature } from './index';
import { html } from 'typed-dom/dom';

export const indexer: ExtensionParser.IndexerParser = surround(
  /^\s+\[(?=\|\S)/,
  union([
    signature,
    creation(1, Recursion.ignore, focus(/^\|(?=\])/, () => [[html('span', { class: 'indexer', 'data-index': '' })], ''])),
  ]),
  /^\]\s*$/);
