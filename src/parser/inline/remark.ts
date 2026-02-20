import { RemarkParser } from '../inline';
import { Recursion } from '../context';
import { union, some, recursion, precedence, surround, close, match, lazy } from '../../combinator';
import { inline } from '../inline';
import { text, str } from '../source';
import { memoize } from 'spica/memoize';
import { unshift, push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const remark: RemarkParser = lazy(() => match(
  /\[(%+)\s/y,
  memoize(
  ([, fence]) =>
    surround(
      str(`[${fence}`),
      precedence(4, recursion(Recursion.inline,
      some(union([inline]), new RegExp(String.raw`\s+${fence}\]`, 'y'), [[new RegExp(String.raw`\s+${fence}\]`, 'y'), 4]]))),
      close(some(text, '%'), str(`${fence}]`)), true,
      ([as, bs = [], cs]) => [[
        html('span', { class: 'remark' }, [
          html('input', { type: 'checkbox' }),
          html('span', defrag(push(unshift(as, bs), cs))),
        ]),
      ]],
      ([as, bs]) => bs && [unshift(as, bs)]),
  ([, fence]) => fence.length, {})));
