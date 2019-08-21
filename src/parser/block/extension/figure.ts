import { ExtensionParser } from '../../block';
import { union, sequence, inits, some, block, line, rewrite, verify, surround, match, convert, trim, fmap } from '../../../combinator';
import { contentline, blankline, emptyline } from '../../source';
import { table } from '../table';
import { codeblock, segment_ as seg_code } from '../codeblock';
import { mathblock, segment_ as seg_math } from '../mathblock';
import { example, segment_ as seg_example } from './example';
import { blockquote, segment as seg_blockquote } from '../blockquote';
import { inline, label, media, shortmedia } from '../../inline';
import { defrag, memoize } from '../../util';
import { html } from 'typed-dom';

import FigureParser = ExtensionParser.FigureParser;

export const segment: FigureParser.SegmentParser = block(match(
  /^(~{3,})figure[^\S\n]+(?=\[?\$[\w-]\S*[^\S\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$))/,
  memoize(([, bracket]) => bracket,
  (bracket, closer = new RegExp(`^${bracket}[^\\S\\n]*(?:\\n|$)`)) =>
    surround(
      '',
      sequence([
        line(label),
        inits([
          // All parsers which can include closing terms.
          union([
            seg_code,
            seg_math,
            seg_example,
            seg_blockquote,
            some(contentline, closer),
          ]),
          emptyline,
          union([
            blankline,
            some(contentline, closer),
          ]),
        ]),
      ]),
      closer))));

export const figure: FigureParser = block(rewrite(segment, trim(verify(fmap(
  convert(
    source => source.slice(source.search(/[[$]/), source.lastIndexOf('\n')),
    sequence([
      line(label),
      inits([
        block(union([
          table,
          codeblock,
          mathblock,
          example,
          blockquote,
          line(media),
          line(shortmedia),
        ])),
        emptyline,
        block(defrag(trim(some(inline)))),
      ]),
    ])),
  ([label, content, ...caption]: [HTMLAnchorElement, ...HTMLElement[]]) => [
    html('figure',
      {
        'data-label': label.getAttribute('data-label')!,
        'data-group': label.getAttribute('data-label')!.split('-', 1)[0],
        style: /^[^-]+-(?:[0-9]+\.)*0$/.test(label.getAttribute('data-label')!)
          ? 'display: none;'
          : undefined,
      },
      [
        html('div', { class: 'figcontent' }, [content]),
        html('span', { class: 'figindex' }),
        html('figcaption', caption)
      ])
  ]),
  ([el]) =>
    el.matches('[data-group="$"]:not([style])')
      ? el.firstElementChild!.firstElementChild!.matches('.math') &&
        el.lastElementChild!.childNodes.length === 0
      : true))));
