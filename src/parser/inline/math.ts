import { undefined } from 'spica/global';
import { MathParser } from '../inline';
import { union, validate, rewrite, creator, surround } from '../../combinator';
import { str } from '../source';
import { html } from 'typed-dom';

export const math: MathParser = creator(validate('${', '}$', '\n', rewrite(
  surround('${', union([str(/^[^\S\n]*(?!}\$)\S[^\n]*?(?=}\$)/)]), '}$'),
  (source, { caches: { math: cache = undefined } = {} }) => [[
    cache?.has(source)
      ? cache.get(source)!.cloneNode(true)
      : source.indexOf('\\begin') === -1
        ? html('span', { class: 'math notranslate', 'data-src': source }, source)
        : html('span', {
            class: 'notranslate invalid',
            'data-invalid-syntax': 'math',
            'data-invalid-type': 'content',
            'data-invalid-description': 'Environments are disallowed with inline syntax.',
          }, source)
  ], ''])));
