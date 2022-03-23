import { CommentParser } from '../inline';
import { eval } from '../../combinator/data/parser';
import { union, some, validate, creator, surround, match, lazy } from '../../combinator';
import { inline } from '../inline';
import { text, str } from '../source';
import { html, defrag } from 'typed-dom';
import { memoize } from 'spica/memoize';
import { unshift, push, pop } from 'spica/array';

export const comment: CommentParser = lazy(() => creator(validate('[#', match(
  /^(?=\[(#+)\s)/,
  memoize(
  ([, fence], closer = new RegExp(String.raw`^\s+${fence}\]`)) =>
    surround(
      str(/^\[(\S+)\s+(?!\1\])/),
      union([some(inline, closer)]),
      str(closer), true,
      ([, bs = []], rest) => [[
        html('span',
          { class: 'comment' },
          defrag(push(unshift([`[${fence} `], bs), [` ${fence}]`]))),
      ], rest],
      ([as, bs = []], rest, context) => [unshift(pop(eval(some(text)(`${as[0]}!`, context))!)[0], bs), rest]),
  ([, fence]) => fence)))));
