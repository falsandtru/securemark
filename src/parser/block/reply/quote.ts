import { ReplyParser } from '../../block';
import { union, some, block, validate, rewrite, convert, lazy, fmap } from '../../../combinator';
import { math } from '../../inline/math';
import { autolink } from '../../inline/autolink';
import { linebreak, unescsource, anyline } from '../../source';
import { html, defrag } from 'typed-dom/dom';

export const syntax = /^>+[^\S\n]/;

export const quote: ReplyParser.QuoteParser = lazy(() => block(fmap(validate(
  '>',
  rewrite(
    some(validate(syntax, anyline)),
    convert(
      source => source.replace(/\n$/, '').replace(/(?<=^>+[^\S\n])/mg, '\r'),
      some(union([
        math, // quote補助関数が残した数式をパースする。他の構文で数式を残す場合はソーステキストを直接使用する。
        autolink,
        linebreak,
        unescsource,
      ])),
      false))),
  (ns: [string, ...(string | HTMLElement)[]]) => [
    html('span', { class: 'quote' }, defrag(ns)),
    html('br'),
  ]),
  false));
