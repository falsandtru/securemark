import { MediaBlockParser } from '../block';
import { union, inits, some, block, line, validate, fallback, fmap } from '../../combinator';
import { medialink, media, shortmedia } from '../inline';
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
    ]), ({ source }) => [[html('div', [html('span', attrs, source.replace('\n', ''))])], '']))),
  ]),
  ns => [html('div', ns)])));

const attrs = {
  class: 'invalid',
  'data-invalid-syntax': 'mediablock',
  'data-invalid-type': 'syntax',
  'data-invalid-message': 'Not media syntax',
} as const;
