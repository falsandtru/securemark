import { ExtensionParser } from '../../block';
import { union, sequence, inits, some, bind, match, surround, contract, verify, block, line, rewrite, convert, trim, eval } from '../../../combinator';
import { emptyline, blankline, contentline } from '../../source/line';
import { table } from '../table';
import { blockquote } from '../blockquote';
import { codeblock, segment_ as seg_code } from '../codeblock';
import { mathblock, segment_ as seg_math } from '../mathblock';
import { example, segment_ as seg_example } from './example';
import { inblock } from '../../inblock';
import { label, media, link, uri } from '../../inline';
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
          line(label),
          inits([
            // All parsers which can include a closing term.
            union([
              seg_code,
              seg_math,
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
        (`${note}\n${rest}`)),
  () => undefined,
]));

export const figure: FigureParser = block(rewrite(segment, verify(match(
  /^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n((?:[^\n]*\n)*?)\1\s*$/,
  ([, , note, body], rest) =>
    bind(
      sequence<FigureParser>([
        line(label),
        inits([
          block(union<FigureParser.ContentParser>([
            table,
            codeblock,
            mathblock,
            example,
            blockquote,
            line(rewrite(
              media,
              convert(
                source => `[${source}]( ${eval(media(source))[0].getAttribute('data-src') || '#'} )`,
                link))),
            line(contract('!', uri, ([node]) => node instanceof Element)),
          ])),
          emptyline,
          block(union<FigureParser.CaptionParser>([
            blankline,
            compress(trim(some(inblock))),
          ])),
        ]),
      ]),
      ([label, content, ...caption]: [HTMLAnchorElement, ...HTMLElement[]]) =>
        [[html('figure',
          {
            class: label.getAttribute('href')!.slice(1),
            'data-group': label.getAttribute('href')!.slice(1).split(':', 2)[1].split('-', 1)[0],
          },
          [
            html('div', { class: 'figcontent' }, [content]),
            html('span', { class: 'figindex' }),
            html('figcaption', caption)
          ])
        ], rest])
      (`${note}\n${body.slice(0, -1)}`)),
  ([el]) =>
    el.matches('[data-group="$"]')
      ? el.firstElementChild!.firstElementChild!.matches('.math')
      : true)));
