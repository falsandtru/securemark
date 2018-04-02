import { ExtensionParser, inline } from '../../inline';
import { union, some, surround, transform, rewrite, build } from '../../../combinator';
import { line } from '../../source/line';
import { link } from '../link';
import { defineIndex } from '../../block/indexer';
import { hasTightText } from '../../util';

export const index: ExtensionParser.IndexParser = line(transform(build(() =>
  surround(
    '[#',
    rewrite(
      some(inline, ']'),
      s => union<ExtensionParser.IndexParser>([link])(`[${s}]()`)),
    ']')),
  ([el], rest) => {
    if (!hasTightText(el)) return;
    void defineIndex(el);
    void el.setAttribute('href', `#${el.id.toLowerCase()}`);
    void el.removeAttribute('id');
    return [[el], rest];
  }
), false);
