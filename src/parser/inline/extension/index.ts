import { ExtensionParser, inline } from '../../inline';
import { union, some, surround, verify, fmap, rewrite, build } from '../../../combinator';
import { line } from '../../source/line';
import { link } from '../link';
import { defineIndex } from '../../block/indexer';
import { hasTightText } from '../../util';

export const index: ExtensionParser.IndexParser = line(verify(fmap(build(() =>
  surround(
    '[#',
    rewrite(
      some(inline, ']'),
      s => union<ExtensionParser.IndexParser>([link])(`[${s}]()`)),
    ']')),
  ([el]) => {
    void defineIndex(el);
    void el.setAttribute('href', `#${el.id}`);
    void el.removeAttribute('id');
    return [el];
  }
), ([el]) => hasTightText(el)), false);
