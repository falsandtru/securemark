import { ExtensionParser } from '../../block';
import { union, sequence, inits, some, bind, match, surround, verify, block, line, rewrite, trim } from '../../../combinator';
import { emptyline, blankline, contentline } from '../../source/line';
import { table } from '../table';
import { blockquote } from '../blockquote';
import { codeblock, segment_ as seg_code } from '../codeblock';
import { mathblock, segment_ as seg_math } from '../mathblock';
import { graph , segment_ as seg_graph } from './graph';
import { example, segment_ as seg_example } from './example';
import { inline } from '../../inline';
import { label, media, shortmedia } from '../../inline';
import { defrag } from '../../util';
import { memoize } from 'spica/memoization';
import { html } from 'typed-dom';

import FigureParser = ExtensionParser.FigureParser;

const closer = memoize<string, RegExp>(pattern => new RegExp(`^${pattern}[^\\S\\n]*(?:\\n|$)`));

export const segment: FigureParser = block(union([
  match(
    /^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n(?=((?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$))/,
    ([, bracket, param], rest) =>
      surround(
        '',
        sequence([
          line(label),
          inits([
            // All parsers which can include a closing term.
            union([
              seg_code,
              seg_math,
              seg_graph,
              seg_example,
              some(contentline, closer(bracket)),
            ]),
            emptyline,
            union([
              blankline,
              some(contentline, closer(bracket)),
            ]),
          ]),
        ]),
        closer(bracket))
        (`${param}\n${rest}`)),
  () => undefined,
]));

export const figure: FigureParser = block(rewrite(segment, verify(match(
  /^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n((?:[^\n]*\n)*?)\1\s*$/,
  ([, , param, body], rest) =>
    bind(
      sequence<FigureParser>([
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
      ]),
      ([label, content, ...caption]: [HTMLAnchorElement, ...HTMLElement[]]) =>
        [[html('figure',
            {
              'data-label': label.getAttribute('data-label')!,
              'data-group': label.getAttribute('data-label')!.split('-', 1)[0],
              ...(label.getAttribute('data-label')!.match(/^[^-]+-\d.*\.0$/)
                ? { style: 'display: none;' }
                : {}),
            },
            [
              html('div', { class: 'figcontent' }, [content]),
              html('span', { class: 'figindex' }),
              html('figcaption', caption)
            ])
        ], rest])
      (`${param}\n${body.slice(0, -1)}`)),
  ([el]) =>
    el.matches('[data-group="$"]')
      ? el.firstElementChild!.firstElementChild!.matches('.math')
      : true)));
