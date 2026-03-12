import { EmphasisParser } from '../inline';
import { Recursion } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, recursion, precedence, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { strong } from './strong';
import { str } from '../source';
import { beforeNonblankWith, afterNonblank } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const emphasis: EmphasisParser = lazy(() => surround(
  str('*', beforeNonblankWith(/(?!\*)/)),
  precedence(0, recursion(Recursion.inline,
  some(union([
    some(inline, '*', afterNonblank),
    strong,
  ])))),
  str('*'),
  false, [],
  ([, bs]) => new List([new Node(html('em', defrag(unwrap(bs))))]),
  ([as, bs]) => bs && as.import(bs as List<Node<string>>)));
