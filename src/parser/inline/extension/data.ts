import { ExtensionParser, inline } from '../../inline';
import { inits, some, creation, backtrack, surround, lazy, fmap } from '../../../combinator';
import { str, char } from '../../source';
import { defrag, startTight } from '../../util';
import { DeepImmutable } from 'spica/type';
import { html } from 'typed-dom';

import DataParser = ExtensionParser.DataParser;

export const data: DataParser = lazy(() => creation(fmap(surround(
  '[~',
  inits([
    str(/^[a-z]+(?:-[a-z0-9]+)*(?:=[a-z0-9]+(?:-[a-z0-9]+)*)?(?=[|\]])/),
    char('|'),
    startTight(some(inline, ']')),
  ]),
  backtrack(str(']'))),
  ns => [html('span', attr(ns.shift()!.textContent!), ns.shift() && defrag(ns))])));

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
