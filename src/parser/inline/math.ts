import { undefined } from 'spica/global';
import { MathParser } from '../inline';
import { union, creator, fmap, surround } from '../../combinator';
import { str } from '../source';
import { html } from 'typed-dom';

export const math: MathParser = creator(fmap(
  surround('${', union([str(/^[^\S\n]*(?!}\$)\S[^\n]*?(?=}\$)/)]), '}$'),
  ([source], _, { caches: { math: cache = undefined } = {} }) => [
    (source = `\${${source.trim()}}$`) && cache?.has(source)
      ? cache.get(source)!.cloneNode(true)
      : html('span', { class: 'math notranslate', 'data-src': source }, source)
  ]));
