import { ItalicParser } from '../inline';
import { Recursion, Command } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, recursion, precedence, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { tightStart, afterNonblank } from '../visibility';
import { unwrap, repeat } from '../util';
import { html, defrag } from 'typed-dom/dom';

// 可読性のため実際にはオブリーク体を指定する。
// 斜体は単語に使うとかえって見づらく読み飛ばしやすくなるため使わないべきであり
// ある程度の長さのある文に使うのが望ましい。
export const italic: ItalicParser = lazy(() =>
  precedence(0, recursion(Recursion.inline, repeat('///', surround(
    '',
    tightStart(some(union([inline]), '///', afterNonblank)),
    '///',
    false, [],
    ([, bs], { buffer }) => buffer.import(bs),
    ([, bs], { buffer }) => bs && buffer.import(bs).push(new Node(Command.Cancel)) && buffer),
    nodes => new List([new Node(html('i', defrag(unwrap(nodes))))])))));
