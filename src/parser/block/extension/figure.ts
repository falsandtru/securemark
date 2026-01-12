import { ExtensionParser } from '../../block';
import { union, inits, sequence, some, block, line, fence, rewrite, close, match, convert, fallback, fmap } from '../../../combinator';
import { str, contentline, emptyline } from '../../source';
import { label, segment as seg_label } from '../../inline/extension/label';
import { ulist } from '../ulist';
import { olist } from '../olist';
import { table as styled_table } from '../table';
import { codeblock, segment_ as seg_code } from '../codeblock';
import { mathblock, segment_ as seg_math } from '../mathblock';
import { example } from './example';
import { table, segment_ as seg_table } from './table';
import { blockquote, segment as seg_blockquote } from '../blockquote';
import { placeholder, segment_ as seg_placeholder } from './placeholder';
import { inline, media, shortmedia } from '../../inline';
import { visualize, trimBlankStart, trimBlankNodeEnd } from '../../visibility';
import { memoize } from 'spica/memoize';
import { html, defrag } from 'typed-dom/dom';

import FigureParser = ExtensionParser.FigureParser;

export const segment: FigureParser.SegmentParser = block(match(
  /^(~{3,})(?:figure[^\S\n])?(?=\[?\$)/,
  memoize(
  ([, fence], closer = new RegExp(String.raw`^${fence}[^\S\n]*(?:$|\n)`)) => close(
    sequence([
      contentline,
      inits([
        // All parsers which can include closing terms.
        union([
          seg_code,
          seg_math,
          seg_table,
          seg_blockquote,
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
  ([, fence]) => fence.length, {})));

export const figure: FigureParser = block(fallback(rewrite(segment, fmap(
  convert(source => source.slice(source.match(/^~+(?:\w+\s+)?/)![0].length, source.trimEnd().lastIndexOf('\n')),
  sequence([
    line(sequence([label, str(/^(?=\s).*\n/)])),
    inits([
      block(union([
        ulist,
        olist,
        styled_table,
        codeblock,
        mathblock,
        example,
        table,
        blockquote,
        placeholder,
        line(media),
        line(shortmedia),
      ])),
      emptyline,
      block(visualize(trimBlankStart(some(inline)))),
    ]),
  ])),
  ([label, param, content, ...caption]: [HTMLAnchorElement, string, ...HTMLElement[]]) => [
    html('figure',
      attributes(label.getAttribute('data-label')!, param, content, caption),
      [
        html('figcaption', [
          html('span', { class: 'figindex' }),
          html('span', { class: 'figtext' }, trimBlankNodeEnd(defrag(caption))),
        ]),
        html('div', [content]),
      ])
  ])),
  fmap(
    fence(/^(~{3,})(?:figure|\[?\$\S*)(?!\S)[^\n]*(?:$|\n)/, 300),
    ([body, overflow, closer, opener, delim]: string[], _, context) => [
      html('pre', {
        class: 'invalid',
        translate: 'no',
        'data-invalid-syntax': 'figure',
        ...
        !closer && {
          'data-invalid-type': 'fence',
          'data-invalid-message': `Missing the closing delimiter "${delim}"`,
        } ||
        overflow && {
          'data-invalid-type': 'fence',
          'data-invalid-message': `Invalid trailing line after the closing delimiter "${delim}"`,
        } ||
        !seg_label({ source: opener.match(/^~+(?:figure[^\S\n]+)?(\[?\$\S+)/)?.[1] ?? '', context }) && {
          'data-invalid-type': 'label',
          'data-invalid-message': 'Invalid label',
        } ||
        /^~+(?:figure[^\S\n]+)?(\[?\$\S+)[^\S\n]+\S/.test(opener) && {
          'data-invalid-type': 'argument',
          'data-invalid-message': 'Invalid argument',
        } ||
        {
          'data-invalid-type': 'content',
          'data-invalid-message': 'Invalid content',
        },
      }, `${opener}${body}${overflow || closer}`),
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
    param.trimStart() !== '' && {
      'data-invalid-type': 'argument',
      'data-invalid-message': 'Invalid argument',
    } ||
    /^[^-]+-(?:[0-9]+\.)*0$/.test(label) && {
      'data-invalid-type': 'label',
      'data-invalid-message': 'The last part of the fixed label numbers must not be 0',
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
