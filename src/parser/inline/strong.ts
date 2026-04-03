import { StrongParser } from '../inline';
import { Recursion } from '../context';
import { List, Node } from '../../combinator/parser';
import { union, some, recursion, precedence, backtrack, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { emphasis } from './emphasis';
import { str } from '../source';
import { beforeNonblankWith, afterNonblank } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const strong: StrongParser = lazy(() => backtrack(surround(
  str('**', beforeNonblankWith(/(?!\*)/)),
  precedence(0, recursion(Recursion.inline,
  some(union([
    some(inline, '*', afterNonblank),
    emphasis,
  ])))),
  str('**'),
  false, [],
  ([, bs], _, output) => output.append(new Node(html('strong', defrag(unwrap(bs))))),
  ([as, bs], _, output) => bs && output.import(as.import(bs as List<Node<string>>)))));
