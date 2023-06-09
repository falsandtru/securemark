import { RemarkParser } from '../inline';
import { union, some, syntax, creation, validate, surround, open, close, match, lazy } from '../../combinator';
import { inline } from '../inline';
import { text, str } from '../source';
import { Syntax, State } from '../context';
import { memoize } from 'spica/memoize';
import { unshift, push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const remark: RemarkParser = lazy(() => validate('[%', creation(syntax(Syntax.none, 4, State.none, match(
  /^\[(%+)\s/,
  memoize(
  ([, fence]) =>
    surround(
      open(str(`[${fence}`), some(text, new RegExp(String.raw`^\s+${fence}\]|^\S`)), true),
      some(union([inline]), new RegExp(String.raw`^\s+${fence}\]`), [[new RegExp(String.raw`^\s+${fence}\]`), 4]]),
      close(some(text, /^\S/), str(`${fence}]`)), true,
      ([as, bs = [], cs], rest) => [[
        html('span', { class: 'remark' }, [
          html('input', { type: 'checkbox' }),
          html('span', defrag(push(unshift(as, bs), cs))),
        ]),
      ], rest],
      ([as, bs = []], rest) => [unshift(as, bs), rest]),
  ([, fence]) => fence.length, {}))))));
