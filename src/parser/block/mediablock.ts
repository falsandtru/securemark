import { MediaBlockParser } from '../block';
import { List, Node } from '../../combinator/parser';
import { union, inits, some, block, line, fallback, fmap } from '../../combinator';
import { medialink, media, lineshortmedia } from '../inline';
import { unwrap, invalid } from '../util';
import { html } from 'typed-dom/dom';

export const mediablock: MediaBlockParser = block(fmap(
  inits([
    line(union([
      medialink,
      media,
      lineshortmedia,
    ]), false),
    some(line(fallback(union([
      medialink,
      media,
      lineshortmedia,
    ]), ({ source }, output) => output.append(
      new Node(html('span', {
        class: 'invalid',
        ...invalid('mediablock', 'syntax', 'Not media syntax'),
      }, source.replace(/\r?\n/, ''))))), false))
  ]),
  ns => new List([new Node(html('div', unwrap(ns)))])));
