import { undefined } from 'spica/global';
import { BracketParser, inline } from '../inline';
import { union, some, surround, lazy } from '../../combinator';
import { str } from '../source';
import { unshift } from 'spica/array';

export const bracket: BracketParser = lazy(() => union([
  surround(str('('), some(inline, ')'), str(')'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('['), some(inline, ']'), str(']'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('{'), some(inline, '}'), str('}'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  // Control media blinking in editing rather than control confusion of pairs of quote marks
  surround(str('"'), some(inline, '"', '"'), str('"'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
]));
