import { CommentParser } from '../inline';
import { union, some, validate, creator, surround, open, close, match, lazy } from '../../combinator';
import { inline } from '../inline';
import { text, str } from '../source';
import { html, defrag } from 'typed-dom';
import { memoize } from 'spica/memoize';
import { unshift, push } from 'spica/array';

export const comment: CommentParser = lazy(() => creator(validate('[#', match(
  /^(?=\[(#+)\s)/,
  memoize(
  ([, fence]) =>
    surround(
      open(str(`[${fence}`), some(text, new RegExp(String.raw`^\s+${fence}\]|^\S`)), true),
      union([some(inline, new RegExp(String.raw`^\s+${fence}\]`))]),
      close(some(text, /^\S/), str(`${fence}]`)), true,
      ([as, bs = [], cs], rest) => [[
        html('span', { class: 'comment' }, [
          html('input', { type: 'checkbox' }),
          html('span', defrag(push(unshift(as, bs), cs))),
        ]),
      ], rest],
      ([as, bs = []], rest) => [unshift(as, bs), rest]),
  ([, fence]) => fence)))));
