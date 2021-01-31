import { undefined } from 'spica/global';
import { ExtensionParser } from '../../block';
import { union, inits, sequence, some, block, line, rewrite, context, close, match, convert, trim, fmap } from '../../../combinator';
import { justify, visualize, defrag } from '../../util';
import { contentline, emptyline } from '../../source';
import { label, segment as seg_label } from '../../inline/extension/label';
import { table as styled_table } from '../table';
import { codeblock, segment_ as seg_code } from '../codeblock';
import { mathblock, segment_ as seg_math } from '../mathblock';
import { blockquote, segment as seg_blockquote } from '../blockquote';
import { example } from './example';
import { table, segment_ as seg_table } from './table';
import { placeholder, segment_ as seg_placeholder } from './placeholder';
import { inline, media, shortmedia } from '../../inline';
import { memoize } from 'spica/memoize';
import { html } from 'typed-dom';

import FigureParser = ExtensionParser.FigureParser;

export const segment: FigureParser.SegmentParser = block(match(
  /^(~{3,})figure[^\S\n]+(?=\[?\$[A-Za-z-]\S*[^\S\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:$|\n))/,
  memoize(
  ([, fence], closer = new RegExp(String.raw`^${fence}[^\S\n]*(?:$|\n)`)) =>
    close(
      sequence([
        line(seg_label),
        inits([
          // All parsers which can include closing terms.
          union([
            seg_code,
            seg_math,
            seg_blockquote,
            seg_table,
            seg_placeholder,
            some(contentline, closer),
          ]),
          emptyline,
          union([
            emptyline,
            some(contentline, closer),
          ]),
        ]),
      ]),
      closer),
  ([, fence]) => fence.length)));

export const figure: FigureParser = block(rewrite(segment, fmap(
  convert(source => source.slice(source.search(/\s/) + 1, source.trimEnd().lastIndexOf('\n')),
  sequence([
    line(label),
    inits([
      block(union([
        styled_table,
        codeblock,
        mathblock,
        blockquote,
        example,
        table,
        placeholder,
        line(media),
        line(shortmedia),
      ])),
      emptyline,
      block(
        context({ syntax: { inline: { media: false } } },
        justify(visualize(trim(some(inline)))))),
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
  ])));

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
        'data-invalid-description': 'The last part of the fixed label numbers must not be 0.',
      } ||
      invalidContent && {
        'data-invalid-syntax': 'figure',
        'data-invalid-type': 'content',
        'data-invalid-description': 'A figure labeled to define a formula number can contain only a math formula and no caption.',
      } ||
      undefined,
  };
}
