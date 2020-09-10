import { ExtensionParser } from '../../block';
import { union, block, line, validate, rewrite, fmap } from '../../../combinator';
import { label, segment as seg_label } from '../../inline/extension/label';
import { html } from 'typed-dom';

export const segment: ExtensionParser.FigbaseParser.SegmentParser = block(validate(
  /^\[?\$-(?:[0-9]+\.)*0\]?[^\S\n]*(?!\S|\n[^\S\n]*\S)/,
  line(union([seg_label]))));

export const figbase: ExtensionParser.FigbaseParser = block(rewrite(segment, fmap(
  line(union([label])),
  ([el]) => {
    const label = el.getAttribute('data-label')!;
    const group = label.split('-', 1)[0];
    return [
      html('figure', {
        'data-label': label,
        'data-group': group,
        style: 'display: none;',
      }),
    ];
  })));
