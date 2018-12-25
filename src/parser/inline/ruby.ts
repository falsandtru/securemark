import { RubyParser } from '../inline';
import { union, sequence, some, fmap, bind, surround, subline, verify } from '../../combinator';
import { htmlentity } from './htmlentity';
import { text } from '../source/text';
import { defrag, hasText, startsWithTightText } from '../util';
import { concat } from 'spica/concat';
import { html, text as txt, frag } from 'typed-dom';

export const ruby: RubyParser = subline(bind(verify(fmap(
  sequence<RubyParser>([
    fmap(verify(
      surround('[', defrag(some(union([htmlentity, text]), /^[\n\]]/)), ']'),
      ([text]) => startsWithTightText(text)),
      ([text]) => [text.textContent!.trim().split(/\s/).map(txt)]),
    fmap(verify(
      surround('(', defrag(some(union([htmlentity, text]), /^[\n)]/)), ')'),
      ([text]) => hasText(text)),
      ([text]) => [text.textContent!.split(/\s/).map(txt)]),
  ]),
  ([text, ruby]) =>
    text.length === 1 && text.length < ruby.length
      ? [[...frag(text).textContent!].map(txt), ruby]
      : [text, ruby]),
  ([text, ruby]) =>
    text.length >= ruby.length),
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
