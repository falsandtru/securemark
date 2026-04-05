import { ReplyParser } from '../../block';
import { List, Node } from '../../../combinator/parser';
import { Flag } from '../../node';
import { union, some, scope, block, validate, rewrite, fmap } from '../../../combinator';
import { math } from '../../inline/math';
import { autolink } from '../../inline/autolink';
import { unescsource, anyline } from '../../source';
import { unwrap } from '../../util';
import { html, defrag } from 'typed-dom/dom';

export const syntax = />+ /y;

export const quote: ReplyParser.QuoteParser = block(fmap(
  rewrite(
    some(validate(syntax, anyline)),
    scope(
      ({ source }) => source.replace(/(?<=^>+ )/gm, '\r'),
      some(union([
        // quote補助関数が残した数式をパースする。
        math,
        autolink,
        unescsource,
      ])),
      true)),
  (ns, { source, position }) => new List([
    new Node(source[position - 1] === '\n' ? ns.pop()!.value as HTMLBRElement : html('br'), position, Flag.blank),
    new Node(html('span', { class: 'quote' }, defrag(unwrap(ns)))),
  ].reverse())),
  false);
