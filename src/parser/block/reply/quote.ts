import { ReplyParser } from '../../block';
import { union, some, creation, block, line, validate, rewrite, convert, lazy, fmap } from '../../../combinator';
import { math } from '../../inline/math';
import { autolink } from '../../inline/autolink';
import { linebreak, unescsource, str, anyline } from '../../source';
import { html, defrag } from 'typed-dom/dom';

export const syntax = /^>+(?=[^\S\n])|^>(?=[^\s>])|^>+(?=[^\s>])(?![0-9a-z]+(?:-[0-9a-z]+)*(?![0-9A-Za-z@#:]))/;

export const quote: ReplyParser.QuoteParser = lazy(() => creation(1, false, block(fmap(validate(
  '>',
  union([
    rewrite(
      some(validate(new RegExp(syntax.source.split('|')[0]), anyline)),
      qblock),
    rewrite(
      validate(new RegExp(syntax.source.split('|').slice(1).join('|')), anyline),
      line(union([str(/^.+/)]))),
  ])),
  (ns: [string, ...(string | HTMLElement)[]]) => [
    html('span',
      ns.length > 1
        ? { class: 'quote' }
        : {
            class: 'quote invalid',
            'data-invalid-syntax': 'quote',
            'data-invalid-type': 'syntax',
            'data-invalid-message': `Missing the whitespace after "${ns[0].split(/[^>]/, 1)[0]}"`,
          },
      defrag(ns)),
    html('br'),
  ]),
  false)));

const qblock: ReplyParser.QuoteParser.BlockParser = convert(
  source => source.replace(/\n$/, '').replace(/(?<=^>+[^\S\n])/mg, '\r'),
  some(union([
    math, // quote補助関数が残した数式をパースする。他の構文で数式を残す場合はソーステキストを直接使用する。
    autolink,
    linebreak,
    unescsource,
  ])));
