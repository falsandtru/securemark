import { MediaBlockParser } from '../block';
import { union, inits, some, block, line, validate, fallback, fmap } from '../../combinator';
import { medialink, media, shortmedia } from '../inline';
import { invalid } from '../util';
import { html } from 'typed-dom/dom';

export const mediablock: MediaBlockParser = block(validate(['[!', '!'], fmap(
  inits([
    line(union([
      medialink,
      media,
      shortmedia,
    ])),
    some(line(fallback(union([
      medialink,
      media,
      shortmedia,
    ]), ({ source }) => [[html('span', {
      class: 'invalid',
      ...invalid('mediablock', 'syntax', 'Not media syntax'),
    }, source.replace('\n', ''))], '']))),
  ]),
  ns => [html('div', ns)])));
