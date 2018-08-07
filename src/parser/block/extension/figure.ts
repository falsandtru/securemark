import { ExtensionParser } from '../../block';
import { SubParsers } from '../../../combinator/parser';
import { union, sequence, inits, some, match, contract, bind, rewrite, trim, trimEnd, eval } from '../../../combinator';
import { block } from '../../source/block';
import { line, emptyline, contentline } from '../../source/line';
import { table } from '../table';
import { blockquote } from '../blockquote';
import { pretext, segment_ as preseg } from '../pretext';
import { math, segment_ as mathseg } from '../math';
import { example, segment_ as examseg } from './example';
import { inline, label, media, link, uri } from '../../inline';
import { compress } from '../../util';
import { html } from 'typed-dom';

import FigureParser = ExtensionParser.FigureParser;

export const segment: FigureParser = block(union([
  match(
    /^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n(?=((?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$))/,
    ([, bracket, note], rest) =>
      bind(
        sequence([
          line(trimEnd(label), true, true),
          inits([
            // All parsers which can include empty lines.
            union([
              preseg,
              mathseg,
              examseg,
            ]),
            inits([
              emptyline,
              union([emptyline, some(contentline)])
            ]),
          ]),
        ]),
        (_, rest) =>
          rest.split('\n')[0].trim() === bracket
            ? [[], rest.slice(rest.split('\n')[0].length + 1)]
            : undefined)
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
              line(trimEnd(source => link(`[${source}]${'('.repeat(source.match(/\)+$/)![0].length)}${eval(media(source))[0].getAttribute('data-src')} ${source.match(/\)+$/)![0]}`)))),
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
