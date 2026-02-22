import { RemarkParser } from '../inline';
import { Recursion } from '../context';
import { union, some, recursion, precedence, focus, surround, close, fallback, lazy } from '../../combinator';
import { inline } from '../inline';
import { text, str } from '../source';
import { invalid } from '../util';
import { unshift, push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const remark: RemarkParser = lazy(() => fallback(surround(
  str(/\[%(?=\s)/y),
  precedence(4, recursion(Recursion.inline,
  some(union([inline]), /\s%\]/y, [[/\s%\]/y, 4]]))),
  close(text, str(`%]`)), true,
  ([as, bs = [], cs]) => [[
    html('span', { class: 'remark' }, [
      html('input', { type: 'checkbox' }),
      html('span', defrag(push(unshift(as, bs), cs))),
    ]),
  ]],
  ([as, bs]) => bs && [unshift(as, bs)]),
  focus(/\[%+(?=\s)/y, ({ context: { source } }) => [[
    html('span', { class: 'invalid', ...invalid('remark', 'syntax', 'Invalid start symbol') }, source)
  ]])));
