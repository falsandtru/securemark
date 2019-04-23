import { BracketParser, inline } from '../inline';
import { union, some, surround, lazy, fmap } from '../../combinator';
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
