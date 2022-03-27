import { ReplyParser } from '../block';
import { inits, subsequence, some, block, validate, rewrite, trim, fmap } from '../../combinator';
import { cite } from './reply/cite';
import { quote, syntax as delimiter } from './reply/quote';
import { inline } from '../inline';
import { anyline } from '../source';
import { localize } from '../locale';
import { visualize } from '../util';
import { html, defrag } from 'typed-dom';
import { push, pop } from 'spica/array';

/*
必ず対象指定から始まる
対象がページである場合>>.を表現方法とする
対象をURLで指定すべき(引用ツリーにルートを追加する)場合はない
対象と引用は1:N(分割)、N:1(統合)のみ可能、N:N(混合)は不可能
*/

export const reply: ReplyParser = block(validate('>', localize(fmap(
  inits([
    some(inits([
      cite,
      quote,
    ])),
    some(subsequence([
      some(quote),
      fmap(rewrite(
        some(anyline, delimiter),
        trim(visualize(some(inline)))),
        ns => push(ns, [html('br')])),
    ])),
  ]),
  ns => [html('p', defrag(pop(ns)[0]))]))));
