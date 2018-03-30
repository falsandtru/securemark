﻿import { ExtensionParser } from '../../block';
import { union, sequence, inits, some, surround, transform, rewrite, trim } from '../../../combinator';
import { block } from '../../source/block';
import { inline, label, url } from '../../inline';
import { table } from '../table';
import { pretext } from '../pretext';
import { math } from '../math';
import { line, contentline } from '../../source/line';
import { compress } from '../../util';
import { html } from 'typed-dom';

const syntax = /^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n/;
const cache = new Map<string, RegExp>();

export const figure: ExtensionParser.FigureParser = block(source => {
  if (!source.startsWith('~~~')) return;
  const [whole = '', bracket = '', note = ''] = source.match(syntax) || [];
  if (!whole) return;
  const [[figlabel = undefined] = []] = label(note) || [];
  if (!figlabel) return;
  const closer = cache.has(bracket)
    ? cache.get(bracket)!
    : cache.set(bracket, new RegExp(`^${bracket}[^\\S\\n]*(?:\\n|$)`)).get(bracket)!;
  return transform(
    surround(
      syntax,
      inits<ExtensionParser.FigureParser>([
        transform(
          rewrite(
            union([pretext, some(contentline, closer)]),
            union<ExtensionParser.FigureParser.ContentParser>([table, pretext, math, line(trim(url), true, true)])),
          ([content], rest) => {
            assert(content);
            if (content instanceof Text) return;
            if (content instanceof HTMLAnchorElement && !content.querySelector('.media')) return;
            return [[content], rest];
          }),
        rewrite(
          sequence([line(s => s.trim() === '' ? [[], ''] : undefined, true, true), some(contentline, closer)]),
          compress(trim(some(union<ExtensionParser.FigureParser.CaptionParser>([inline]))))),
      ]),
      closer),
    (es, rest) => [
      [
        html('figure',
          { class: figlabel.getAttribute('href')!.slice(1) },
          [
            es[0],
            html('figcaption',
              { 'data-type': figlabel.getAttribute('href')!.slice(1).split(':', 2)[1].split('-', 1)[0] },
              [html('span', es.slice(1))])
          ])
      ],
      rest
    ])
    (source);
});
