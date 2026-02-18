import { ItalicParser } from '../inline';
import { Recursion, Command } from '../context';
import { union, some, recursion, precedence, validate, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { tightStart, blankWith } from '../visibility';
import { repeat } from '../util';
import { push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

// 可読性のため実際にはオブリーク体を指定する。
// 斜体は単語に使うとかえって見づらく読み飛ばしやすくなるため使わないべきであり
// ある程度の長さのある文に使うのが望ましい。
export const italic: ItalicParser = lazy(() => validate('///',
  precedence(0, repeat('///', surround(
    '',
    recursion(Recursion.inline,
    tightStart(some(union([
      some(inline, blankWith('///')),
      open(some(inline, '/'), italic),
    ])))),
    '///', false,
    ([, bs]) => [bs],
    ([, bs]) => bs && [push(bs, [Command.Cancel])]),
    nodes => [html('i', defrag(nodes))]))));
