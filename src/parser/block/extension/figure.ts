import { ExtensionParser } from '../../block';
import { union, sequence, inits, some, block, line, rewrite, verify, surround, match, convert, trim, fmap } from '../../../combinator';
import { emptyline, blankline, contentline } from '../../source/line';
import { table } from '../table';
import { blockquote } from '../blockquote';
import { codeblock, segment_ as seg_code } from '../codeblock';
import { mathblock, segment_ as seg_math } from '../mathblock';
import { graph , segment_ as seg_graph } from './graph';
import { example, segment_ as seg_example } from './example';
import { inline } from '../../inline';
import { label, media, shortmedia } from '../../inline';
import { defrag, memoize } from '../../util';
import { html } from 'typed-dom';

import FigureParser = ExtensionParser.FigureParser;

export const segment: FigureParser = block(match(
  /^(~{3,})figure[^\S\n]+(?=\[:\S+?\][^\S\n]*\n(?:(?!\1[^\S\n]*(?:\n|$))[^\n]*\n){0,300}\1[^\S\n]*(?:\n|$))/,
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
            seg_graph,
            seg_example,
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

export const figure: FigureParser = block(rewrite(segment, trim(fmap(verify(
  convert(
    source => source.slice(source.indexOf('['), source.lastIndexOf('\n')),
    sequence([
      line(label),
      inits([
        block(union<FigureParser.ContentParser>([
          table,
          codeblock,
          mathblock,
          graph,
          example,
          blockquote,
          line(media),
          line(shortmedia),
        ])),
        emptyline,
        block(union<FigureParser.CaptionParser>([
          blankline,
          defrag(trim(some(inline))),
        ])),
      ]),
    ])),
  ([label, content, ...caption]: [HTMLAnchorElement, ...HTMLElement[]]) =>
    label.getAttribute('data-label')!.split('-', 1)[0] === '$'
      ? content.matches('.math') && caption.length === 0
      : true),
  ([label, content, ...caption]: [HTMLAnchorElement, ...HTMLElement[]]) => [
    html('figure',
      {
        'data-label': label.getAttribute('data-label')!,
        'data-group': label.getAttribute('data-label')!.split('-', 1)[0],
        style: label.getAttribute('data-label')!.match(/^[^-]+-(?:\d+\.)+0$/)
          ? 'display: none;'
          : undefined,
      },
      [
        html('div', { class: 'figcontent' }, [content]),
        html('span', { class: 'figindex' }),
        html('figcaption', caption)
      ])
  ]))));
