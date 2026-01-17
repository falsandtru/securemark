import { ItalicParser } from '../inline';
import { Recursion, Command } from '../context';
import { union, some, recursion, precedence, validate, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { tightStart, blankWith } from '../visibility';
import { repeat } from '../util';
import { push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

// 斜体は単語に使うとかえって見づらく読み飛ばしやすくなるため使わないべきであり
// ある程度の長さのある文に使うのが望ましい。
export const italic: ItalicParser = lazy(() => recursion(Recursion.inline, validate('///',
  precedence(0, repeat('///', surround(
    '',
    tightStart(some(union([
      some(inline, blankWith('///')),
      open(some(inline, '/'), italic),
    ]))),
    '///', false,
    ([, bs], rest) => [bs, rest],
    ([, bs], rest) => [push(bs, [Command.Escape]), rest]),
    nodes => [html('i', defrag(nodes))])))));
