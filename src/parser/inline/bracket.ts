import { BracketParser, inline } from '../inline';
import { union, some, fmap, surround, build } from '../../combinator';
import { compress } from '../util';
import { text } from 'typed-dom';

export const bracket: BracketParser = build(() => compress(union([
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
