import { MathParser } from '../inline';
import { union, creator, surround, fmap } from '../../combinator';
import { str } from '../source';
import { html } from 'typed-dom';
import { Cache } from 'spica/cache';

export const cache = new Cache<string, HTMLElement>(20); // for rerendering in editing

export const math: MathParser = creator(fmap(
  surround('${', union([str(/^(?:(?!}\$)[^\n])+/)]), '}$'),
  ([{ data: source }]) =>
    cache.has(source = `\${${source.trim()}}$`)
      ? [cache.get(source)!.cloneNode(true)]
      : [html('span', { class: 'math notranslate', 'data-src': source }, source)]));
