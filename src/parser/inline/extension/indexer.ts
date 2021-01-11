import { ExtensionParser } from '../../inline';
import { union, line, creator, context, open, fmap } from '../../../combinator';
import { index } from './index';
import { html } from 'typed-dom';

export const indexer: ExtensionParser.IndexerParser = creator(fmap(open(
  /^\s+(?=\[#[^\s\]])/,
  context({ syntax: { inline: {
    index: true,
  }}},
  line(union([index])))),
  ([el]) => [
    html('span', { class: 'indexer', 'data-index': el.getAttribute('href')!.slice(el.hash.indexOf(':') + 1) }),
  ]));
