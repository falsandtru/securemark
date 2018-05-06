import { ExtensionParser } from '../../block';
import { union, inits, some, capture, contract, fmap, bind, rewrite, trim } from '../../../combinator';
import { block } from '../../source/block';
import { inline, label, url } from '../../inline';
import { table } from '../table';
import { blockquote } from '../blockquote';
import { pretext } from '../pretext';
import { math } from '../math';
import { line, emptyline, contentline } from '../../source/line';
import { compress } from '../../util';
import { html } from 'typed-dom';

import FigureParser = ExtensionParser.FigureParser;

export const segment: FigureParser = block(union([
  capture(
    /^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n/,
    ([, bracket, note], rest) => {
      if (!label(note)) return;
      return bind(
        inits([
          // pretext
          capture(
            /^(`{3,})[^\n]*\n(?:[\s\S]*?\n)?\1[^\S\n]*(?:\n|$)/,
            (_, rest) => [[], rest]),
          inits([emptyline, union([emptyline, some(contentline)])]),
        ]),
        (_, rest) =>
          rest.split('\n')[0].trim() === bracket
            ? [[], rest.slice(rest.split('\n')[0].length + 1)]
            : undefined)
        (rest);
    }),
  capture(
    /^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n(?:([\s\S]*?)\n)?\1[^\S\n]*(?:\n|$)/,
    (_, rest) => [[], rest]),
]));

export const figure: FigureParser = block(rewrite(
  segment,
  capture(
    /^(~{3,})figure[^\S\n]+(\[:\S+?\])[^\S\n]*\n(?:([\s\S]*?)\n)?\1[^\S\n]*\n?$/,
    ([, , note, body = ''], rest) => {
      assert(rest === '');
      const [[figlabel = undefined] = []] = label(note) || [];
      if (!figlabel) return;
      return fmap(
        inits<FigureParser>([
          union([
            table,
            blockquote,
            pretext,
            math,
            line(contract('!', trim(url), ([node]) => node instanceof Element), true, true),
          ]),
          rewrite(
            inits([emptyline, union([emptyline, some(contentline)])]),
            compress(trim(some(union([inline]))))),
        ]),
        ([content, ...caption]) =>
          [fig(figlabel, content, caption)])
        (body);
    })));

function fig(label: HTMLAnchorElement, content: HTMLElement | Text, caption: (HTMLElement | Text)[]): HTMLElement {
  return html('figure',
    { class: label.getAttribute('href')!.slice(1) },
    [
      content,
      html('figcaption',
        { 'data-type': label.getAttribute('href')!.slice(1).split(':', 2)[1].split('-', 1)[0] },
        [html('span', caption)])
    ]);
}
