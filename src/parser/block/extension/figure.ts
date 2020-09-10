import { undefined, RegExp } from 'spica/global';
import { ExtensionParser } from '../../block';
import { union, sequence, inits, some, block, line, rewrite, context, fmap, close, match, memoize, convert, trim } from '../../../combinator';
import { defrag } from '../../util';
import { contentline, emptyline } from '../../source';
import { label, segment as seg_label } from '../../inline/extension/label';
import { table } from '../table';
import { codeblock, segment_ as seg_code } from '../codeblock';
import { mathblock, segment_ as seg_math } from '../mathblock';
import { example, segment_ as seg_example } from './example';
import { blockquote, segment as seg_blockquote } from '../blockquote';
import { blankline } from '../paragraph';
import { inline, media, shortmedia } from '../../inline';
import { html } from 'typed-dom';

import FigureParser = ExtensionParser.FigureParser;

export const segment: FigureParser.SegmentParser = block(match(
  /^(~{3,})figure[^\S\n]+(?=\[?\$[\w-]\S*[^\S\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:$|\n))/,
  memoize(([, fence]) => fence,
  (fence, closer = new RegExp(`^${fence}[^\\S\\n]*(?:$|\\n)`)) =>
    close(
      sequence([
        line(seg_label),
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
        context({ syntax: { inline: { media: false } } },
        trim(some(inline))))),
    ]),
  ])),
  ([label, content, ...caption]: [HTMLAnchorElement, ...HTMLElement[]]) => [
    html('figure',
      attributes(label.getAttribute('data-label')!, content, caption),
      [
        html('div', { class: 'figcontent' }, [content]),
        html('span', { class: 'figindex' }),
        html('figcaption', defrag(caption))
      ])
  ]))));

function attributes(label: string, content: HTMLElement, caption: readonly HTMLElement[]): Record<string, string | undefined> {
  const group = label.split('-', 1)[0];
  const invalidLabel = /^[^-]+-(?:[0-9]+\.)*0$/.test(label);
  const invalidContent = group === '$' && (!content.classList.contains('math') || caption.length > 0);
  const invalid = invalidLabel || invalidContent || undefined;
  return {
    'data-label': label,
    'data-group': group,
    class: invalid && 'invalid',
    ...
      invalidLabel && {
        'data-invalid-syntax': 'figure',
        'data-invalid-type': 'label',
        'data-invalid-message': 'The last part of the fixed label numbers must not be 0',
      } ||
      invalidContent && {
        'data-invalid-syntax': 'figure',
        'data-invalid-type': 'content',
        'data-invalid-message': 'A figure labeled to define a formula number can contain only a math formula and no caption',
      } ||
      undefined,
  };
}
