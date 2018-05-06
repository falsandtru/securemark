import { ExtensionParser } from '../../block';
import { union, inits, some, capture, contract, surround, fmap, rewrite, trim } from '../../../combinator';
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
    return fmap(
      surround(
        '',
        inits<FigureParser>([
          rewrite(
            union([
              pretext,
              some(contentline, closer)
            ]),
            union([
              table,
              pretext,
              math,
              line(contract('!', trim(url), ([node]) => node instanceof Element), true, true),
            ])),
          rewrite(
            inits([emptyline, union([emptyline, some(contentline, closer)])]),
            compress(trim(some(union([inline]))))),
        ]),
        closer),
      ([content, ...caption]) =>
        [fig(figlabel, content, caption)])
      (rest);
  }));

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
