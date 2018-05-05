import { ExtensionParser } from '../../block';
import { union, inits, some, capture, surround, transform, rewrite, trim } from '../../../combinator';
import { block } from '../../source/block';
import { inline, label, url } from '../../inline';
import { table } from '../table';
import { pretext } from '../pretext';
import { math } from '../math';
import { line, emptyline, contentline } from '../../source/line';
import { compress } from '../../util';
import { html } from 'typed-dom';

import FigureParser = ExtensionParser.FigureParser;

const cache = new Map<string, RegExp>();

export const figure: FigureParser = block(capture(
  /^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n/,
  ([, bracket, note], rest) => {
    const [[figlabel = undefined] = []] = label(note) || [];
    if (!figlabel) return;
    const closer = cache.has(bracket)
      ? cache.get(bracket)!
      : cache.set(bracket, new RegExp(`^${bracket}[^\\S\\n]*(?:\\n|$)`)).get(bracket)!;
    return transform(
      surround(
        '',
        inits<FigureParser>([
          transform(
            rewrite(
              union([pretext, some(contentline, closer)]),
              union([table, pretext, math, line(trim(url), true, true)])),
            ([content], rest) => {
              assert(content);
              if (content instanceof Text) return;
              if (content instanceof HTMLAnchorElement && !content.querySelector('.media')) return;
              return [[content], rest];
            }),
          rewrite(
            inits([emptyline, union([emptyline, some(contentline, closer)])]),
            compress(trim(some(union([inline]))))),
        ]),
        closer),
      ([content, ...caption], rest) => [
        [
          html('figure',
            { class: figlabel.getAttribute('href')!.slice(1) },
            [
              content,
              html('figcaption',
                { 'data-type': figlabel.getAttribute('href')!.slice(1).split(':', 2)[1].split('-', 1)[0] },
                [html('span', caption)])
            ])
        ],
        rest
      ])
      (rest);
  }));
