import { undefined } from 'spica/global';
import { BracketParser } from '../inline';
import { union, some, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { html, defrag } from 'typed-dom';
import { unshift, push } from 'spica/array';

const index = /^(?:[0-9]+(?:\.[0-9]+)*|[A-Za-z])/;
const indexFW = new RegExp(index.source.replace(/[019AZaz](?!,)/g, c => String.fromCharCode(c.charCodeAt(0) + 0xfee0)));

export const bracket: BracketParser = lazy(() => union([
  surround(str('('), str(index), str(')'), false,
    ([as, bs = [], cs], rest) => [defrag(push(unshift(as, bs), cs)), rest]),
  surround(str('（'), str(indexFW), str('）'), false,
    ([as, bs = [], cs], rest) => [defrag(push(unshift(as, bs), cs)), rest]),
  surround(str('('), some(inline, ')'), str(')'), true,
    ([as, bs = [], cs], rest) => [[html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))], rest],
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('（'), some(inline, '）'), str('）'), true,
    ([as, bs = [], cs], rest) => [[html('span', { class: 'paren' }, defrag(push(unshift(as, bs), cs)))], rest],
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('['), some(inline, ']'), str(']'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('{'), some(inline, '}'), str('}'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
  // Control media blinking in editing rather than control confusion of pairs of quote marks.
  surround(str('"'), some(inline, '"', '"'), str('"'), true,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
]));
