import { undefined } from 'spica/global';
import { MarkdownParser } from '../../markdown';
import { inits, block, firstline, focus, rewrite, clear } from '../combinator';
import { defrag } from './util';
import { segment } from './segment';
import { normalize } from './api/normalize';
import { str } from './source';
import { html } from 'typed-dom';

export const header: MarkdownParser.HeaderParser = inits([
  rewrite(
    source => {
      const seg = firstline(source).trimEnd() === '---' && segment(source).next().value || '';
      assert(source.startsWith(seg));
      return seg
        ? [[], source.slice(seg.length)]
        : undefined;
    },
    block(focus(
      /^---[^\S\v\f\r\n]*\r?\n(?:[A-Za-z][0-9A-Za-z]*(?:-[A-Za-z][0-9A-Za-z]*)*:[ \t]+\S[^\v\f\r\n]*\r?\n){0,100}---[^\S\v\f\r\n]*(?:$|\r?\n)/,
      source => [[
        html('details', { class: 'header' }, defrag([
          html('summary', 'Header'),
          normalize(source.slice(source.indexOf('\n') + 1, source.trimEnd().lastIndexOf('\n'))).replace(/\s+$/mg, ''),
        ]))
      ], '']))),
  clear(str(/^[^\S\v\f\r\n]*\r?\n/)),
]);
