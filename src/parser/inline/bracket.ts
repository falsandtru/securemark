import { BracketParser, inline } from '../inline';
import { union, some, surround, transform, build } from '../../combinator';
import { compress } from '../util';

export const bracket: BracketParser = build(() => compress(union<BracketParser>([
  transform(
    surround('(', some(inline, ')'), ')'),
    (ns, rest) => [[document.createTextNode('('), ...ns, document.createTextNode(')')], rest]),
  transform(
    surround('[', some(inline, ']'), ']'),
    (ns, rest) => [[document.createTextNode('['), ...ns, document.createTextNode(']')], rest]),
  transform(
    surround('{', some(inline, '}'), '}'),
    (ns, rest) => [[document.createTextNode('{'), ...ns, document.createTextNode('}')], rest]),
  transform(
    surround('<', some(inline, '>'), '>'),
    (ns, rest) => [[document.createTextNode('<'), ...ns, document.createTextNode('>')], rest]),
  transform(
    surround('"', some(inline, '"'), '"'),
    (ns, rest) => [[document.createTextNode('"'), ...ns, document.createTextNode('"')], rest]),
])));
