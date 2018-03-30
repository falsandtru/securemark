import { ExtensionParser } from '../../block';
import { combine, some, surround, transform } from '../../../combinator';
import { block } from '../../source/block';
import { inline, label, url } from '../../inline';
import { table } from '../table';
import { pretext } from '../pretext';
import { math } from '../math';
import { compress } from '../../util';
import { html } from 'typed-dom';

const syntax = /^(~{3,})figure[^\S\n]+(\[:[^\]]+\])[^\S\n]*\n/;
const cache = new Map<string, [RegExp, RegExp]>();

export const figure: ExtensionParser.FigureParser = block(source => {
  if (!source.startsWith('~~~')) return;
  const [whole = '', bracket = '', note = ''] = source.match(syntax) || [];
  if (!whole) return;
  const [[figlabel = undefined] = []] = label(note) || [];
  if (!figlabel) return;
  const [closer, closer_] = cache.has(bracket)
    ? cache.get(bracket)!
    : cache.set(bracket, [new RegExp(`^\\n${bracket}[^\\S\\n]*(?:\\n|$)`), new RegExp(`\\n${bracket}[^\\S\\n]*(?:\\n|$)`)]).get(bracket)!;
  return transform(combine<ExtensionParser.FigureParser>([table, pretext, math, url]), ([content], rest) => {
    if (content instanceof Text) return;
    if (content instanceof HTMLAnchorElement && !content.querySelector('.media')) return;
    const next = rest;
    return transform(surround('', some(combine<ExtensionParser.FigureParser>([inline]), closer), closer), (_, rest) => {
      const [caption = []] = compress(some(inline))(next.slice(0, next.lastIndexOf(bracket, next.length - rest.length - 1)).trim()) || [];
      return [
        [
          html('figure', { class: figlabel.getAttribute('href')!.slice(1) }, [
            content,
            html('figcaption', {
              'data-type': figlabel.getAttribute('href')!.slice(1).split(':', 2)[1].split('-', 1)[0],
            }, [html('span', caption)])
          ])
        ],
        rest
      ];
    })(next);
  })(source.slice(source.indexOf('\n') + 1).replace(closer_, '\n$&'));
});
