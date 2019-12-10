import { ExtensionParser } from '../../block';
import { union, sequence, inits, some, block, line, rewrite, surround, match, memoize, convert, trim, configure, fmap } from '../../../combinator';
import { contentline, emptyline } from '../../source';
import { table } from '../table';
import { codeblock, segment_ as seg_code } from '../codeblock';
import { mathblock, segment_ as seg_math } from '../mathblock';
import { example, segment_ as seg_example } from './example';
import { blockquote, segment as seg_blockquote } from '../blockquote';
import { blankline } from '../paragraph';
import { inline, label, media, shortmedia } from '../../inline';
import { defrag } from '../../util';
import { html } from 'typed-dom';

import FigureParser = ExtensionParser.FigureParser;

export const segment: FigureParser.SegmentParser = block(match(
  /^(~{3,})figure[^\S\n]+(?=\[?\$[\w-]\S*[^\S\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$))/,
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
            seg_example,
            seg_blockquote,
            some(contentline, closer),
          ]),
          emptyline,
          union([
            emptyline,
            some(contentline, closer),
          ]),
        ]),
      ]),
      closer))));

export const figure: FigureParser = block(rewrite(segment, trim(fmap(
  convert(source => source.slice(source.search(/[[$]/), source.lastIndexOf('\n')),
  sequence([
    line(label),
    inits([
      block(union([
        table,
        codeblock,
        mathblock,
        example,
        blockquote,
        line(media),
        line(shortmedia),
      ])),
      emptyline,
      block(
        convert(source => source.replace(blankline, ''),
        configure({ syntax: { inline: { media: false } } },
        defrag(trim(some(inline)))))),
    ]),
  ])),
  ([label, content, ...caption]: [HTMLAnchorElement, ...HTMLElement[]]) => [
    html('figure',
      attrs(label.getAttribute('data-label')!, content, caption),
      [
        html('div', { class: 'figcontent' }, [content]),
        html('span', { class: 'figindex' }),
        html('figcaption', caption)
      ])
  ]))));

function attrs(label: string, content: HTMLElement, caption: readonly HTMLElement[]): Record<string, string | undefined> {
  const group = label.split('-', 1)[0];
  const rebase = /^[^-]+-(?:[0-9]+\.)*0$/.test(label) || undefined;
  const invalid = group !== '$' || rebase
    ? undefined
    : !content.classList.contains('math') || caption.length > 0 || undefined;
  return {
    'data-label': label,
    'data-group': group,
    style: rebase && 'display: none;',
    class: invalid && 'invalid',
    'data-invalid-syntax': invalid && 'figure',
    'data-invalid-type': invalid && 'content',
  };
}
