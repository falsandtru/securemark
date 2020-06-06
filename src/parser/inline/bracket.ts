import { undefined } from 'spica/global';
import { BracketParser, inline } from '../inline';
import { union, some, surround, lazy } from '../../combinator';
import { char } from '../source';
import { unshift } from 'spica/array';

export const bracket: BracketParser = lazy(() => union([
  surround(char('('), some(inline, ')'), char(')'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('['), some(inline, ']'), char(']'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('{'), some(inline, '}'), char('}'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
]));
