import { ExtensionParser, inline } from '../../inline';
import { inits, some, creator, backtracker, surround, lazy, fmap } from '../../../combinator';
import { defrag, startTight } from '../../util';
import { str, char } from '../../source';
import { DeepImmutable } from 'spica/type';
import { html } from 'typed-dom';
import { shift } from 'spica/array';

import DataParser = ExtensionParser.DataParser;

export const data: DataParser = lazy(() => creator(fmap(surround(
  '[~',
  inits([
    str(/^[a-z]+(?:-[a-z0-9]+)*(?:=[a-z0-9]+(?:-[a-z0-9]+)*)?(?=[|\]])/),
    char('|'),
    startTight(some(inline, ']')),
  ]),
  backtracker(str(']'))),
  ns => [defrag(html('span', attr(ns.shift()!.textContent!), shift(ns)[1]))])));

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
