import { ExtensionParser } from '../../inline';
import { union, creator, context, surround } from '../../../combinator';
import { index } from './index';
import { str } from '../../source';
import { html } from 'typed-dom';

export const indexer: ExtensionParser.IndexerParser = creator(surround(
  str(/^\s+(?=\[#[^\s\]])/),
  context({ syntax: { inline: {
    index: true,
  }}},
  union([index])),
  /^\s*$/, false,
  ([, [el]], rest) => [
    [html('span', { class: 'indexer', 'data-index': el.getAttribute('href')!.slice(el.hash.indexOf(':') + 1) })],
    rest
  ]));
