import { ReplyParser } from '../../block';
import { union, some, block, validate, rewrite, convert, lazy, fmap } from '../../../combinator';
import { math } from '../../inline/math';
import { autolink } from '../../inline/autolink';
import { linebreak, unescsource, anyline } from '../../source';
import { linearize } from '../../util';
import { html, defrag } from 'typed-dom/dom';

export const syntax = />+[^\S\n]/y;

export const quote: ReplyParser.QuoteParser = lazy(() => block(fmap(
  rewrite(
    some(validate(syntax, anyline)),
    linearize(convert(
      source => source.replace(/(?<=^>+[^\S\n])/mg, '\r'),
      some(union([
        // quote補助関数が残した数式をパースする。
        math,
        autolink,
        linebreak,
        unescsource,
      ])),
      false), -1)),
  (ns: [string, ...(string | HTMLElement)[]]) => [
    html('span', { class: 'quote' }, defrag(ns)),
    html('br'),
  ]),
  false));
