import { ExtensionParser } from '../../block';
import { SubParsers } from '../../../combinator/parser';
import { union, sequence, inits, some, match, surround, contract, bind, rewrite, trim, trimEnd, eval } from '../../../combinator';
import { block } from '../../source/block';
import { line, emptyline, contentline } from '../../source/line';
import { table } from '../table';
import { blockquote } from '../blockquote';
import { pretext, segment_ as seg_pre } from '../pretext';
import { math, segment_ as seg_math } from '../math';
import { example, segment_ as seg_example } from './example';
import { inline, label, media, link, uri } from '../../inline';
import { compress } from '../../util';
import { memoize } from 'spica/memoization';
import { html } from 'typed-dom';

import FigureParser = ExtensionParser.FigureParser;

const closer = memoize<string, RegExp>(pattern => new RegExp(`^${pattern}[^\\S\\n]*(?:\\n|$)`));

export const segment: FigureParser = block(union([
  match(
    /^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n(?=((?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$))/,
    ([, bracket, note], rest) =>
      surround(
        '',
        sequence([
          line(trimEnd(label), true, true),
          inits([
            // All parsers which can include a closing term.
            union([
              seg_pre,
              seg_math,
              seg_example,
            ]),
            inits([
              emptyline,
              union([emptyline, some(contentline, closer(bracket))])
            ]),
          ]),
        ]),
        closer(bracket))
        (`${note}\n${rest}`)),
  match(
    /^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n((?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$)/,
    (_, rest) => [[], rest]),
]));

export const figure: FigureParser = block(rewrite(segment, trimEnd(match(
  /^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n((?:[^\n]*\n)*?)\1$/,
  ([, , note, body], rest) =>
    bind(
      sequence<FigureParser>([
        line(trimEnd(label), true, true),
        inits<SubParsers<FigureParser>[1]>([
          block(union([
            table,
            pretext,
            math,
            example,
            blockquote,
            rewrite(
              line(trimEnd(media), true, true),
              line(trimEnd(source => link(`[${source}]( ${eval(media(source))[0].getAttribute('data-src')} )`)))),
            line(contract('!', trimEnd(uri), ([node]) => node instanceof Element), true, true),
          ])),
          rewrite(
            inits([
              emptyline,
              union([emptyline, some(contentline)])
            ]),
            compress(trim(some(union([inline])))))
        ]),
      ]),
      ([label, content, ...caption]: [HTMLAnchorElement, ...HTMLElement[]]) =>
        [[html('figure',
          {
            class: label.getAttribute('href')!.slice(1),
            'data-type': label.getAttribute('href')!.slice(1).split(':', 2)[1].split('-', 1)[0],
          },
          [
            content,
            html('figcaption', [html('span', caption)])
          ])
        ], rest])
      (`${note}\n${body.slice(0, -1)}`)))));
