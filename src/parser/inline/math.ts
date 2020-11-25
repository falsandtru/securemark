import { undefined } from 'spica/global';
import { MathParser } from '../inline';
import { union, creator, bind, surround } from '../../combinator';
import { str } from '../source';
import { html } from 'typed-dom';
import { Cache } from 'spica/cache';

export const cache = new Cache<string, HTMLElement>(20); // for rerendering in editing

export const math: MathParser = creator(bind(
  surround('${', union([str(/^[^\n]+?(?=}\$)/)]), '}$'),
  ([source], rest, { caches: { math: cache = undefined } = {} }) =>
    (source = `\${${source.trim()}}$`) === '${}$'
      ? undefined
      : [
          cache?.has(source)
            ? [cache.get(source)!.cloneNode(true)]
            : [html('span', { class: 'math notranslate', 'data-src': source }, source)],
          rest
        ]));
