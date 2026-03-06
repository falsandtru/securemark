import { ItalicParser } from '../inline';
import { Recursion, Command } from '../context';
import { List, Data } from '../../combinator/data/parser';
import { union, some, recursion, precedence, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { tightStart, blankWith } from '../visibility';
import { unwrap, repeat } from '../util';
import { html, defrag } from 'typed-dom/dom';

// 可読性のため実際にはオブリーク体を指定する。
// 斜体は単語に使うとかえって見づらく読み飛ばしやすくなるため使わないべきであり
// ある程度の長さのある文に使うのが望ましい。
export const italic: ItalicParser = lazy(() =>
  precedence(0, repeat('///', surround(
    '',
    recursion(Recursion.inline,
    tightStart(some(union([
      some(inline, blankWith('///')),
      open(some(inline, '/'), inline),
    ])))),
    '///',
    false, [],
    ([, bs], { buffer }) => buffer!.import(bs),
    ([, bs], { buffer }) => bs && buffer!.import(bs).push(new Data(Command.Cancel)) && buffer!),
    nodes => new List([new Data(html('i', defrag(unwrap(nodes))))]))));
