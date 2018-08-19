import { ExtensionParser, inline } from '../../inline';
import { union, some, fmap, surround, verify, subline, rewrite, build } from '../../../combinator';
import { link } from '../link';
import { defineIndex } from '../../block/indexer';
import { startsWithTightText } from '../../util';

export const index: ExtensionParser.IndexParser = subline(verify(fmap(build(() =>
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
), ([el]) => startsWithTightText(el)));
