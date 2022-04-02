import { undefined } from 'spica/global';
import { ExtensionParser } from '../../block';
import { union, inits, sequence, some, block, line, rewrite, context, close, match, convert, trim, fmap } from '../../../combinator';
import { str, contentline, emptyline } from '../../source';
import { label, segment as seg_label } from '../../inline/extension/label';
import { ulist } from '../ulist';
import { olist } from '../olist';
import { table as styled_table } from '../table';
import { codeblock, segment_ as seg_code } from '../codeblock';
import { mathblock, segment_ as seg_math } from '../mathblock';
import { blockquote, segment as seg_blockquote } from '../blockquote';
import { example } from './example';
import { table, segment_ as seg_table } from './table';
import { placeholder, segment_ as seg_placeholder } from './placeholder';
import { inline, media, shortmedia } from '../../inline';
import { localize } from '../../locale';
import { visualize } from '../../util';
import { html, defrag } from 'typed-dom';
import { memoize } from 'spica/memoize';
import { unshift } from 'spica/array';

import FigureParser = ExtensionParser.FigureParser;

export const segment: FigureParser.SegmentParser = block(match(
  /^(~{3,})(?:figure[^\S\n]+)?(?=\[?\$[A-Za-z-][^\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:$|\n))/,
  memoize(
  ([, fence], closer = new RegExp(String.raw`^${fence}[^\S\n]*(?:$|\n)`)) =>
    close(
      sequence([
        line(close(seg_label, /^.*\n/)),
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
  convert(source => source.slice(source.search(/[[$]/), source.trimEnd().lastIndexOf('\n')),
  sequence([
    line(sequence([label, str(/^.*\n/)])),
    inits([
      block(union([
        ulist,
        olist,
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
      block(localize(
        context({ syntax: { inline: { media: false } } },
        trim(visualize(some(inline)))))),
    ]),
  ])),
  ([label, param, content, ...caption]: [HTMLAnchorElement, string, ...HTMLElement[]]) => [
    html('figure',
      attributes(label.getAttribute('data-label')!, param, content, caption),
      [
        html('div', [content]),
        html('figcaption', unshift(
          [html('span', { class: 'figindex' })],
          defrag(caption))),
      ])
  ])));

function attributes(label: string, param: string, content: HTMLElement, caption: readonly HTMLElement[]): Record<string, string | undefined> {
  const group = label.split('-', 1)[0];
  const invalidLabel = /^[^-]+-(?:[0-9]+\.)*0$/.test(label);
  const invalidParam = param.trimStart() !== '';
  const invalidContent = group === '$' && (!content.classList.contains('math') || caption.length > 0);
  const invalid = invalidLabel || invalidParam || invalidContent || undefined;
  let type: string = content.className.split(/\s/)[0];
  switch (type || content.tagName) {
    case 'UL':
    case 'OL':
      type = 'list';
      break;
    case 'TABLE':
      type = 'table';
      break;
    case 'BLOCKQUOTE':
      type = 'quote';
      break;
    case 'A':
      type = 'media';
      break;
    case 'text':
    case 'code':
    case 'math':
    case 'example':
    case 'invalid':
      break;
    default:
      assert(false);
  }
  return {
    'data-type': type,
    'data-label': label,
    'data-group': group,
    class: invalid && 'invalid',
    ...
      invalidLabel && {
        'data-invalid-syntax': 'figure',
        'data-invalid-type': 'label',
        'data-invalid-message': 'The last part of the fixed label numbers must not be 0',
      } ||
      invalidParam && {
        'data-invalid-syntax': 'figure',
        'data-invalid-type': 'argument',
        'data-invalid-message': 'Invalid argument',
      } ||
      invalidContent && {
        'data-invalid-syntax': 'figure',
        'data-invalid-type': 'content',
        'data-invalid-message': 'A figure labeled to define a formula number can contain only a math formula and no caption',
      } ||
      undefined,
  };
}
