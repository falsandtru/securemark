import { AnnotationParser } from '../inline';
import { State, Recursion } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, recursions, precedence, constraint, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { indexA } from './bracket';
import { beforeNonblank, trimBlankNodeEnd } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const annotation: AnnotationParser = lazy(() => constraint(State.annotation, surround(
  open('((', beforeNonblank),
  precedence(1, recursions([Recursion.inline, Recursion.bracket, Recursion.bracket],
  some(union([inline]), ')', [[')', 1]]))),
  '))',
  false, [],
  ([, ns], context) => {
    const { linebreak } = context;
    if (linebreak === 0) {
      return new List([new Node(html('sup', { class: 'annotation' }, [html('span', defrag(unwrap(trimBlankNodeEnd(ns))))]))]);
    }
    ns.unshift(new Node('('));
    ns.push(new Node(')'));
    return new List([new Node(html('span', { class: 'bracket' }, ['(', html('span', { class: 'bracket' }, defrag(unwrap(ns))), ')']))]);
  },
  ([, bs = new List()], context) => {
    const { source, position, range, linebreak } = context;
    if (linebreak === 0 && bs.length === 3 && source[position - range + 2] === '(' && source[position] === ')' && source[position - 1] === ')') {
      context.position += 1;
      return new List([new Node(html('span', { class: 'bracket' }, ['(', html('sup', { class: 'annotation' }, [html('span', [bs.head!.next!.value])])]))]);
    }
    if (linebreak === 0 && bs.length === 1 && source[position] === ')' && typeof bs.head?.value === 'object' && bs.head.value.className === 'bracket') {
      const { firstChild, lastChild } = bs.head.value;
      assert(firstChild instanceof Text);
      if (firstChild!.nodeValue!.length === 1) {
        firstChild!.remove();
      }
      else {
        firstChild!.nodeValue = firstChild!.nodeValue!.slice(1);
      }
      assert(lastChild instanceof Text);
      if (lastChild!.nodeValue!.length === 1) {
        lastChild!.remove();
      }
      else {
        lastChild!.nodeValue = lastChild!.nodeValue!.slice(0, -1);
      }
      context.position += 1;
      return new List([new Node(html('span', { class: 'bracket' }, ['(', html('sup', { class: 'annotation' }, [html('span', bs.head.value.childNodes)])]))]);
    }
    const str = linebreak === 0 ? source.slice(position - range + 2, position) : '';
    if (linebreak === 0 && indexA.test(str)) {
      return new List([new Node(html('span', { class: 'bracket' }, ['((' + str]))]);
    }
    bs.unshift(new Node('('));
    return new List([new Node(html('span', { class: 'bracket' }, ['(', html('span', { class: 'bracket' }, defrag(unwrap(bs)))]))]);
  })));
