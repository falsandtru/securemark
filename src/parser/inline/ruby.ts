import { RubyParser } from '../inline';
import { union, sequence, some, subline, validate, verify, surround, fmap } from '../../combinator';
import { htmlentity } from './htmlentity';
import { text } from '../source/text';
import { defrag, trimNodeEnd, stringify, hasText, hasTightText } from '../util';
import { concat } from 'spica/concat';
import { html, text as txt } from 'typed-dom';

export const ruby: RubyParser = subline(fmap(fmap(verify(fmap(validate(
  /^\[.+?\]\(.+?\)/,
  sequence<RubyParser>([
    fmap(verify(trimNodeEnd(
      surround('[', defrag(some(union([htmlentity, text]), /^[\n\]]/)), ']')),
      ([text]) => hasTightText(text)),
      ([text]) => [text.textContent!.split(/\s/).map(txt)]),
    fmap(verify(
      surround('(', defrag(some(union([htmlentity, text]), /^[\n)]/)), ')'),
      ([text]) => hasText(text)),
      ([text]) => [text.textContent!.split(/\s/).map(txt)]),
  ])),
  ([text, ruby]) =>
    text.length === 1 && text.length < ruby.length
      ? [[...stringify(text)].map(txt), ruby]
      : [text, ruby]),
  ([text, ruby]) =>
    text.length >= ruby.length),
  ([text, ruby]) => [
    text
      .reduce((acc, _, i) =>
        concat(concat(acc, [text[i]]),
          i < ruby.length && ruby[i].textContent!.trim() !== ''
            ? [html('rp', '('), html('rt', [ruby[i]]), html('rp', ')')]
            : [html('rt')])
      , [])
  ]),
  ([ns]) =>
    [html('ruby', ns)]));
