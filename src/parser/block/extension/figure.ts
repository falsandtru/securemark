import { undefined } from 'spica/global';
import { ExtensionParser } from '../../block';
import { union, inits, sequence, some, block, line, rewrite, context, close, match, convert, trim, fmap } from '../../../combinator';
import { str, contentline, emptyline } from '../../source';
import { label } from '../../inline/extension/label';
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
  /^(~{3,})(?:figure[^\S\n]+)?(?=\[?\$[A-Za-z-][^\n]*\n)/,
  memoize(
  ([, fence], closer = new RegExp(String.raw`^${fence}[^\S\n]*(?:$|\n)`)) =>
    close(
      sequence([
        contentline,
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
  ([, fence]) => fence.length, [])));

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
        html('figcaption', unshift(
          [html('span', { class: 'figindex' })],
          defrag(caption))),
        html('div', [content]),
      ])
  ])));

function attributes(label: string, param: string, content: HTMLElement, caption: readonly HTMLElement[]): Record<string, string | undefined> {
  const group = label.split('-', 1)[0];
  let type: string = content.className.split(/\s/)[0];
  switch (type || content.tagName) {
    case 'UL':
    case 'OL':
    case 'checklist':
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
  const invalid =
    /^[^-]+-(?:[0-9]+\.)*0$/.test(label) && {
      'data-invalid-type': 'label',
      'data-invalid-message': 'The last part of the fixed label numbers must not be 0',
    } ||
    param.trimStart() !== '' && {
      'data-invalid-type': 'argument',
      'data-invalid-message': 'Invalid argument',
    } ||
    group === '$' && (type !== 'math' || caption.length > 0) && {
      'data-invalid-type': 'label',
      'data-invalid-message': '"$" label group must be used to math formulas with no caption',
    } ||
    type === 'media' && {} ||
    ['fig', 'figure'].includes(group) && {
      'data-invalid-type': 'label',
      'data-invalid-message': '"fig" and "figure" label groups must be used to media',
    } ||
    group === 'table' && type !== group && {
      'data-invalid-type': 'label',
      'data-invalid-message': '"table" label group must be used to tables',
    } ||
    group === 'list' && type !== group && {
      'data-invalid-type': 'label',
      'data-invalid-message': '"list" label group must be used to lists',
    } ||
    group === 'quote' && type !== group && {
      'data-invalid-type': 'label',
      'data-invalid-message': '"quote" label group must be used to blockquotes',
    } ||
    group === 'text' && type !== group && {
      'data-invalid-type': 'label',
      'data-invalid-message': '"text" label group must be used to codeblocks with no language',
    } ||
    group === 'code' && type !== group && {
      'data-invalid-type': 'label',
      'data-invalid-message': '"code" label group must be used to codeblocks with any language',
    } ||
    group === 'example' && type !== group && {
      'data-invalid-type': 'label',
      'data-invalid-message': '"example" label group must be used to examples',
    } ||
    undefined;
  return {
    'data-type': type,
    'data-label': label,
    'data-group': group,
    ...invalid?.['data-invalid-type'] && {
      class: 'invalid',
      'data-invalid-syntax': 'figure',
      ...invalid,
    },
  };
}
