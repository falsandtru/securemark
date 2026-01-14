import { ItalicParser } from '../inline';
import { Recursion } from '../context';
import { union, some, creation, precedence, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { startTight, blankWith } from '../visibility';
import { unshift } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

// 斜体は単語に使うとかえって見づらく読み飛ばしやすくなるため使わないべきであり
// ある程度の長さのある文に使うのが望ましい。
export const italic: ItalicParser = lazy(() => creation(1, Recursion.inline, surround(
  str('///', '/'),
  precedence(0,
  startTight(some(union([
    some(inline, blankWith('///')),
    open(some(inline, '/'), italic),
  ])))),
  str('///'), false,
  ([, bs], rest) => [[html('i', defrag(bs))], rest],
  ([as, bs], rest) => [unshift(as, bs), rest])));
