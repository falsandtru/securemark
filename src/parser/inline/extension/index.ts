import { ExtensionParser, inline } from '../../inline';
import { union, some, surround, verify, subline, focus, fmap, build } from '../../../combinator';
import { link } from '../link';
import { defineIndex } from '../../block/indexer';
import { hasTightText } from '../../util';

export const index: ExtensionParser.IndexParser = subline(verify(fmap(build(() =>
  surround(
    '[#',
    focus(
      some(inline, ']'),
      s => union<ExtensionParser.IndexParser>([link])(`[${s}]()`)),
    ']')),
  ([el]) => {
    void defineIndex(el);
    void el.setAttribute('href', `#${el.id}`);
    void el.removeAttribute('id');
    return [el];
  }
), ([el]) => hasTightText(el)));
