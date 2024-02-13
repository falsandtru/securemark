import { Caches } from '../../..';
import { Clock } from 'spica/clock';
import { TLRU } from 'spica/tlru';

// For rerendering in editing.

/*
同一文書内で複数回使用される可能性が低いデータ: Clock
同一文書内で複数回使用される可能性が高いデータ: TLRU

編集時の再描画高速化が主目的であるためブロックを周期とするループおよび
異なるブロックへのジャンプに適したアルゴリズムを使用。
キャッシュサイズはブロック内の全データをキャッシュできなければならない。
キャッシュサイズは100あれば足りるが10,000までは速度低下しないようなので
データサイズを加味して100から1,000とする。
遠くで少数の同じデータを高速描画してもあまり意味はない。
タイムラインとスレッドのmediaにおいても多数の同一データが長周期で複数回表示
される適切な状況はないと思われる。
同一投稿は頻繁に再送されてはならずスパムは削除されなければならず
ジャーゴンは考慮に値しない。

*/

export const caches: Caches = {
  code: new Clock<string, HTMLElement>(1000),
  math: new TLRU<string, HTMLElement>(1000),
  media: new Clock<string, HTMLElement>(100),
} as const;
