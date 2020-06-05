import { ExtensionParser, inline } from '../../inline';
import { inits, some, creator, surround, lazy } from '../../../combinator';
import { startTight, isEndTight, trimEnd, defrag, stringify } from '../../util';
import { str, char } from '../../source';
import { DeepImmutable } from 'spica/type';
import { html } from 'typed-dom';
import { unshift, push } from 'spica/array';

import DataParser = ExtensionParser.DataParser;

export const data: DataParser = lazy(() => creator(surround(
  str('[~'),
  inits([
    str(/^[a-z]+(?:-[a-z0-9]+)*(?:=[a-z0-9]+(?:-[a-z0-9]+)*)?(?=[|\]])/),
    char('|'),
    startTight(some(inline, ']')),
  ]),
  char(']'), false,
  ([as, bs, cs], rest) => [
    isEndTight(bs)
      ? [html('span', attributes(stringify(bs[0])), defrag(trimEnd(bs.slice(2))))]
      : push(unshift(as, bs), cs),
    rest
  ],
  ([as, bs], rest) => [unshift(as, bs), rest])));

function attributes(data: string): DeepImmutable<Record<string, string>> {
  assert(data !== '');
  const name = data.split('=', 1)[0];
  const value = data.slice(name.length + 1);
  return {
    class: `data-${name}`,
    'data-name': name,
    'data-value': value,
  };
}
