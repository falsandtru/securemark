import { ItalicParser } from '../inline';
import { Recursion, Command } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, precedence, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { repeat } from '../repeat';
import { beforeNonblank, afterNonblank } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

// 可読性のため実際にはオブリーク体を指定する。
// 斜体は単語に使うとかえって見づらく読み飛ばしやすくなるため使わないべきであり
// ある程度の長さのある文に使うのが望ましい。
export const italic: ItalicParser = lazy(() =>
  repeat('///', beforeNonblank, '///', Recursion.inline, precedence(0, surround(
    '',
    some(union([inline]), '///', afterNonblank),
    '///',
    false, [],
    ([, bs], { buffer }) => buffer.import(bs),
    ([, bs], { buffer }) => bs && buffer.import(bs).push(new Node(Command.Cancel)) && buffer)),
    nodes => new List([new Node(html('i', defrag(unwrap(nodes))))])));
