import { ExtensionParser } from '../../inline';
import { union, creation, state, focus, surround } from '../../../combinator';
import { signature } from './index';
import { State } from '../../context';
import { html } from 'typed-dom/dom';

export const indexer: ExtensionParser.IndexerParser = surround(
  /^\s+\[(?=\|\S)/,
  state(State.index, false,
  union([
    signature,
    creation(focus(/^\|(?=\])/, () => [[html('span', { class: 'indexer', 'data-index': '' })], ''])),
  ])),
  /^\]\s*$/);
