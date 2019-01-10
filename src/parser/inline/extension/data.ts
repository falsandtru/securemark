import { ExtensionParser, inline } from '../../inline';
import { union, inits, some, focus, surround, fmap, lazy } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { defrag } from '../../util';
import { html } from 'typed-dom';

import DataParser = ExtensionParser.DataParser;

export const data: DataParser = lazy(() => fmap(
  surround(
    '[~',
    inits([
      focus(
        /^[a-z]+(?:-[a-z0-9]+)*(?:=[a-z0-9]+(?:-[a-z0-9]+)*)?/,
        defrag(some(unescsource))),
      surround(
        '|',
        union([defrag(some(inline, ']'))]),
        '',
        false),
    ]),
    ']'),
  ([data, ...ns]) =>
    [html('span', attr(data.textContent!), ns)]));

function attr(data: string): Record<string, string> {
  assert(data !== '');
  const name = data.split('=', 1)[0];
  const value = data.slice(name.length + 1);
  return {
    class: `data-${name}`,
    'data-name': name,
    'data-value': value,
  };
}
