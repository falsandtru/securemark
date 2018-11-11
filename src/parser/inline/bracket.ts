import { BracketParser, inline } from '../inline';
import { union, some, fmap, surround, lazy } from '../../combinator';
import { compress } from '../util';
import { text } from 'typed-dom';

export const bracket: BracketParser = lazy(() => compress(union([
  fmap(
    surround('(', some(inline, ')'), ')', false),
    ns => [text('('), ...ns, text(')')]),
  fmap(
    surround('[', some(inline, ']'), ']', false),
    ns => [text('['), ...ns, text(']')]),
  fmap(
    surround('{', some(inline, '}'), '}', false),
    ns => [text('{'), ...ns, text('}')]),
  fmap(
    surround('<', some(inline, '>'), '>', false),
    ns => [text('<'), ...ns, text('>')]),
  fmap(
    surround('"', some(inline, '"'), '"', false),
    ns => [text('"'), ...ns, text('"')]),
])));
