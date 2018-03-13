import { BracketParser, inline } from '../inline';
import { build, combine, some, surround, transform } from '../../combinator';
import { squash } from '../util';

export const bracket: BracketParser = build(() => combine<BracketParser>([
  transform(
    surround('(', some(inline, ')'), ')'),
    (ns, rest) => [squash([document.createTextNode('('), ...ns, document.createTextNode(')')]), rest]),
  transform(
    surround('[', some(inline, ']'), ']'),
    (ns, rest) => [squash([document.createTextNode('['), ...ns, document.createTextNode(']')]), rest]),
  transform(
    surround('{', some(inline, '}'), '}'),
    (ns, rest) => [squash([document.createTextNode('{'), ...ns, document.createTextNode('}')]), rest]),
  transform(
    surround('<', some(inline, '>'), '>'),
    (ns, rest) => [squash([document.createTextNode('<'), ...ns, document.createTextNode('>')]), rest]),
]));
