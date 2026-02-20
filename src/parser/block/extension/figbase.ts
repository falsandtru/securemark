import { ExtensionParser } from '../../block';
import { union, block, line, validate, fmap } from '../../../combinator';
import { label } from '../../inline/extension/label';
import { html } from 'typed-dom/dom';

export const figbase: ExtensionParser.FigbaseParser = block(fmap(
  validate(/\[?\$-(?:[0-9]+\.)*0\]?[^\S\n]*(?!\S|\n[^\S\n]*\S)/y,
  line(union([label]))),
  ([el]) => {
    const label = el.getAttribute('data-label')!;
    const group = label.split('-', 1)[0];
    return [
      html('figure', {
        'data-label': label,
        'data-group': group,
        hidden: '',
      }),
    ];
  }));
