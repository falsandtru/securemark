import { ExtensionParser } from '../../block';
import { List, Node } from '../../../combinator/data/parser';
import { union, block, line, validate, fmap } from '../../../combinator';
import { label } from '../../inline/extension/label';
import { html } from 'typed-dom/dom';

export const figbase: ExtensionParser.FigbaseParser = block(fmap(
  validate(/\[?\$-(?:[0-9]+\.)*0\]?[^\S\r\n]*(?:$|\r?\n)/y,
  line(union([label]))),
  ([{ value: el }]) => {
    const label = el.getAttribute('data-label')!;
    const group = label.split('-', 1)[0];
    return new List([
      new Node(html('figure', {
        'data-label': label,
        'data-group': group,
        hidden: '',
      })),
    ]);
  }));
