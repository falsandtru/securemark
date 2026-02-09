import { RemarkParser } from '../inline';
import { Recursion } from '../context';
import { union, some, recursion, precedence, surround, close, match, lazy } from '../../combinator';
import { inline } from '../inline';
import { text, str } from '../source';
import { memoize } from 'spica/memoize';
import { unshift, push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const remark: RemarkParser = lazy(() => match(
  /^\[(%+)\s/,
  memoize(
  ([, fence]) =>
    surround(
      str(`[${fence}`),
      precedence(4, recursion(Recursion.inline,
      some(union([inline]), new RegExp(String.raw`^\s+${fence}\]`), [[new RegExp(String.raw`^\s+${fence}\]`), 4]]))),
      close(some(text, '%'), str(`${fence}]`)), true,
      ([as, bs = [], cs], rest) => [[
        html('span', { class: 'remark' }, [
          html('input', { type: 'checkbox' }),
          html('span', defrag(push(unshift(as, bs), cs))),
        ]),
      ], rest],
      ([as, bs = []], rest) => [unshift(as, bs), rest]),
  ([, fence]) => fence.length, {}), false));
