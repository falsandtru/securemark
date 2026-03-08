import { ReplyParser } from '../../block';
import { List, Node } from '../../../combinator/data/parser';
import { union, some, block, validate, rewrite, convert, lazy, fmap } from '../../../combinator';
import { math } from '../../inline/math';
import { autolink } from '../../inline/autolink';
import { unescsource, anyline } from '../../source';
import { unwrap } from '../../util';
import { html, defrag } from 'typed-dom/dom';

export const syntax = />+ /y;

export const quote: ReplyParser.QuoteParser = lazy(() => block(fmap(
  rewrite(
    some(validate(syntax, anyline)),
    convert(
      source => source.replace(/(?<=^>+ )/gm, '\r'),
      some(union([
        // quote補助関数が残した数式をパースする。
        math,
        autolink,
        unescsource,
      ])))),
  (ns, { source, position }) => new List([
    new Node(source[position - 1] === '\n' ? ns.pop()!.value as HTMLBRElement : html('br')),
    new Node(html('span', { class: 'quote' }, defrag(unwrap(ns)))),
  ].reverse())),
  false));
