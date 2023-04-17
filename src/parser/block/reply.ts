import { ReplyParser } from '../block';
import { inits, subsequence, some, block, validate, rewrite, fmap } from '../../combinator';
import { cite } from './reply/cite';
import { quote, syntax as delimiter } from './reply/quote';
import { inline } from '../inline';
import { anyline } from '../source';
import { visualize, trimNodeEnd } from '../visibility';
import { push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

/*
必ず対象指定から始まる
対象がページである場合>>.を表現方法とする
対象をURLで指定すべき(引用ツリーにルートを追加する)場合はない
対象と引用は1:N(分割)、N:1(統合)のみ可能、N:N(混合)は不可能
*/

export const reply: ReplyParser = block(validate('>', fmap(
  inits([
    some(inits([
      cite,
      quote,
    ])),
    some(subsequence([
      some(quote),
      fmap(rewrite(
        some(anyline, delimiter),
        visualize(some(inline))),
        ns => push(ns, [html('br')])),
    ])),
  ]),
  ns => [html('p', trimNodeEnd(defrag(ns)))])));
