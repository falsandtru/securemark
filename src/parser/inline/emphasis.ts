import { EmphasisParser } from '../inline';
import { Recursion } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, recursion, precedence, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { strong } from './strong';
import { str } from '../source';
import { tightStart, nonblankWith } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const emphasis: EmphasisParser = lazy(() => surround(
  str(/\*(?!\*)/y),
  precedence(0, recursion(Recursion.inline,
  tightStart(some(union([
    some(inline, nonblankWith('*')),
    strong,
  ]))))),
  str('*'),
  false, [],
  ([, bs]) => new List([new Node(html('em', defrag(unwrap(bs))))]),
  ([as, bs]) => bs && as.import(bs as List<Node<string>>)));
