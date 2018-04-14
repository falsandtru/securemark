import { BracketParser, inline } from '../inline';
import { union, some, surround, transform, build } from '../../combinator';
import { compress } from '../util';
import { text } from 'typed-dom';

export const bracket: BracketParser = build(() => compress(union([
  transform(
    surround('(', some(inline, ')'), ')', false),
    (ns, rest) => [[text('('), ...ns, text(')')], rest]),
  transform(
    surround('[', some(inline, ']'), ']', false),
    (ns, rest) => [[text('['), ...ns, text(']')], rest]),
  transform(
    surround('{', some(inline, '}'), '}', false),
    (ns, rest) => [[text('{'), ...ns, text('}')], rest]),
  transform(
    surround('<', some(inline, '>'), '>', false),
    (ns, rest) => [[text('<'), ...ns, text('>')], rest]),
  transform(
    surround('"', some(inline, '"'), '"', false),
    (ns, rest) => [[text('"'), ...ns, text('"')], rest]),
])));
