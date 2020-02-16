import { ExtensionParser, inline } from '../../inline';
import { inits, some, creator, backtracker, open, close, lazy } from '../../../combinator';
import { isTight, defrag } from '../../util';
import { str, char } from '../../source';
import { DeepImmutable } from 'spica/type';
import { html } from 'typed-dom';

import DataParser = ExtensionParser.DataParser;

export const data: DataParser = lazy(() => creator(close(open(
  str('[~'),
  inits([
    str(/^[a-z]+(?:-[a-z0-9]+)*(?:=[a-z0-9]+(?:-[a-z0-9]+)*)?(?=[|\]])/),
    char('|'),
    some(inline, ']'),
  ])),
  backtracker(str(']')),
  (ns, rest) => [
    ns.length <= 3 || isTight(ns, 3, -1)
      ? [defrag(html('span', attrs(ns[1].textContent!), ns.slice(3, -1)))]
      : ns,
    rest
  ])));

function attrs(data: string): DeepImmutable<Record<string, string>> {
  assert(data !== '');
  const name = data.split('=', 1)[0];
  const value = data.slice(name.length + 1);
  return {
    class: `data-${name}`,
    'data-name': name,
    'data-value': value,
  };
}
