import { MathParser } from '../inline';
import { union, validate, rewrite, creator, surround } from '../../combinator';
import { str } from '../source';
import { html } from 'typed-dom';

const disallowedCommand = /\\(?:begin|tiny|huge|large)(?![0-9a-z])/i;

export const math: MathParser = creator(validate('${', '}$', '\n', rewrite(
  surround('${', union([str(/^[^\S\n]*(?!}\$)\S[^\n]*?(?=}\$)/)]), '}$'),
  (source, { caches: { math: cache } = {} }) => [[
    cache?.has(source)
      ? cache.get(source)!.cloneNode(true)
      : !disallowedCommand.test(source)
        ? html('span', { class: 'math notranslate', 'data-src': source }, source)
        : html('span', {
            class: 'notranslate invalid',
            'data-invalid-syntax': 'math',
            'data-invalid-type': 'content',
            'data-invalid-description': `"${source.match(disallowedCommand)![0]}" command is disallowed.`,
          }, source)
  ], ''])));
