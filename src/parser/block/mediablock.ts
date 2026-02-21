import { MediaBlockParser } from '../block';
import { union, inits, some, block, line, validate, fallback, fmap } from '../../combinator';
import { medialink, media, lineshortmedia } from '../inline';
import { invalid } from '../util';
import { html } from 'typed-dom/dom';

export const mediablock: MediaBlockParser = block(validate(/\[?!/y, fmap(
  inits([
    line(union([
      medialink,
      media,
      lineshortmedia,
    ])),
    some(line(fallback(union([
      medialink,
      media,
      lineshortmedia,
    ]), ({ context: { source } }) => [[html('span', {
      class: 'invalid',
      ...invalid('mediablock', 'syntax', 'Not media syntax'),
    }, source.replace('\n', ''))]]))),
  ]),
  ns => [html('div', ns)])));
