import { ExtensionParser, inline } from '../../inline';
import { inits, some, verify, focus, surround, fmap, lazy } from '../../../combinator';
import { unescsource } from '../../source';
import { defrag, trimTextEnd, hasTightContent } from '../../util';
import { DeepImmutable } from 'spica/type';
import { html } from 'typed-dom';

import DataParser = ExtensionParser.DataParser;

export const data: DataParser = lazy(() => verify(fmap(
  surround(
    '[~',
    inits([
      focus(
        /^[a-z]+(?:-[a-z0-9]+)*(?:=[a-z0-9]+(?:-[a-z0-9]+)*)?/,
        defrag(some(unescsource))),
      surround('|', trimTextEnd(defrag(some(inline, ']'))), '', false),
    ]),
    ']'),
  ([data, ...ns]) =>
    [html('span', attr(data.textContent!), ns)]),
  ([el]) => el.childNodes.length === 0 || hasTightContent(el)));

function attr(data: string): DeepImmutable<Record<string, string>> {
  assert(data !== '');
  const name = data.split('=', 1)[0];
  const value = data.slice(name.length + 1);
  return {
    class: `data-${name}`,
    'data-name': name,
    'data-value': value,
  };
}
