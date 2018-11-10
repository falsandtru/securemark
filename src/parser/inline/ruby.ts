import { RubyParser } from '../inline';
import { union, sequence, some, fmap, bind, surround, subline, verify, build } from '../../combinator';
import { htmlentity } from './htmlentity';
import { text } from '../source/text';
import { compress, hasText, hasTightText } from '../util';
import { concat } from 'spica/concat';
import { html, text as txt, frag } from 'typed-dom';

export const ruby: RubyParser = subline(bind(fmap(build(() =>
  sequence<RubyParser>([
    fmap(verify(
      surround('[', compress(some(union([htmlentity, text]), /^[\n\]]/)), ']'),
      ([text]) => hasTightText(text)),
      ([text]) => [text.textContent!.split(/\s/).map(txt)]),
    fmap(verify(
      surround('{', compress(some(union([htmlentity, text]), /^[\n}]/)), '}'),
      ([text]) => hasText(text)),
      ([text]) => [text.textContent!.split(/\s/).map(txt)]),
  ])),
  ([text, ruby]) =>
    text.length === 1 && text.length < ruby.length
      ? [[...frag(text).textContent!].map(txt), ruby]
      : [text, ruby]),
  ([text, ruby], rest) =>
    [[html('ruby',
        text
          .reduce((acc, _, i) =>
            concat(concat(acc, [text[i]]),
              i < ruby.length && ruby[i].textContent!.trim() !== ''
                ? [html('rp', '('), html('rt', [ruby[i]]), html('rp', ')')]
                : [html('rt')])
          , []))],
      rest]));
