import { BracketParser, inline } from '../inline';
import { union, some, fmap, surround, lazy } from '../../combinator';
import { defrag } from '../util';
import { text } from 'typed-dom';

export const bracket: BracketParser = lazy(() => defrag(union([
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
