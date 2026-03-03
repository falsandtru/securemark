import { ReplyParser } from '../../block';
import { List, Data } from '../../../combinator/data/parser';
import { union, some, block, validate, rewrite, convert, lazy, fmap } from '../../../combinator';
import { math } from '../../inline/math';
import { autolink } from '../../inline/autolink';
import { linebreak, unescsource, anyline } from '../../source';
import { unwrap } from '../../util';
import { html, defrag } from 'typed-dom/dom';

export const syntax = />+ /y;

export const quote: ReplyParser.QuoteParser = lazy(() => block(fmap(
  rewrite(
    some(validate(syntax, anyline)),
    convert(
      // TODO: インデント数を渡してインデント数前の行頭確認を行う実装に置き換える
      source => source.replace(/(?<=^>+ )/mg, '\r'),
      some(union([
        // quote補助関数が残した数式をパースする。
        math,
        autolink,
        linebreak,
        unescsource,
      ])),
      false)),
  (ns, { source, position }) => new List([
    new Data(source[position - 1] === '\n' ? ns.pop()!.value as HTMLBRElement : html('br')),
    new Data(html('span', { class: 'quote' }, defrag(unwrap(ns)))),
  ].reverse())),
  false));
