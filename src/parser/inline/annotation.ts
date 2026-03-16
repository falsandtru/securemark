import { AnnotationParser } from '../inline';
import { State, Recursion } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, recursions, precedence, constraint, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { indexA } from './bracket';
import { beforeNonblank, trimBlankNodeEnd } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

// シグネチャ等生成のために構文木のツリーウォークを再帰的に行い指数計算量にならないよう
// 動的計画法を適用するか再帰数を制限する必要がある。
// 動的計画法においては再帰的記録により指数空間計算量にならないよう下位の記録を消しながら記録しなければならない。
// トリムも再帰的に行わないよう前後のトリムサイズの記録を要する。
// しかし理論的には無制限の再帰が可能だがホバーテキストの記録やハッシュの計算を行う言語仕様から指数計算量を
// 避けられないためAnnotation構文に限り再帰数の制限が必要となる。
// シグネチャやハッシュは分割計算可能にすれば解決するがホバーテキストは記録せず動的に再計算して
// 表示しなければ指数空間計算量を避けられない。
// 注釈は本来再帰的に行うものではないため再帰数を制限して機能を優先するのが合理的となる。
const MAX_DEPTH = 20;
export const annotation: AnnotationParser = lazy(() => constraint(State.annotation, surround(
  open('((', beforeNonblank),
  precedence(1, recursions([Recursion.annotation, Recursion.inline, Recursion.bracket, Recursion.bracket],
  some(union([inline]), ')', [[')', 1]]))),
  '))',
  false, [],
  ([, ns], context) => {
    const { linebreak, recursion, resources } = context;
    const depth = MAX_DEPTH - (resources?.recursions[Recursion.annotation] ?? resources?.recursions.at(-1) ?? MAX_DEPTH);
    if (linebreak === 0) {
      recursion.add(depth);
      return new List([new Node(html('sup', { class: 'annotation' }, [html('span', defrag(unwrap(trimBlankNodeEnd(ns))))]))]);
    }
    ns.unshift(new Node('('));
    ns.push(new Node(')'));
    return new List([new Node(html('span', { class: 'bracket' }, ['(', html('span', { class: 'bracket' }, defrag(unwrap(ns))), ')']))]);
  },
  ([, bs = new List()], context) => {
    const { source, position, range, linebreak, recursion, resources } = context;
    const depth = MAX_DEPTH - (resources?.recursions[Recursion.annotation] ?? resources?.recursions.at(-1) ?? MAX_DEPTH);
    if (linebreak === 0 && bs.length === 1 && source[position] === ')' && typeof bs.head?.value === 'object') {
      const { className } = bs.head.value;
      if (className === 'paren' || className === 'bracket') {
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
        recursion.add(depth);
        return new List([new Node(html('span', { class: 'bracket' }, ['(', html('sup', { class: 'annotation' }, [html('span', bs.head.value.childNodes)])]))]);
      }
      if (className === 'annotation' && deepunwrap(bs)) {
        context.position += 1;
        recursion.add(depth);
        return new List([new Node(html('span', { class: 'bracket' }, ['(', html('sup', { class: 'annotation' }, [html('span', [bs.head.value])])]))]);
      }
    }
    const str = linebreak === 0 ? source.slice(position - range + 2, position) : '';
    if (linebreak === 0 && indexA.test(str)) {
      return new List([new Node(html('span', { class: 'bracket' }, ['((' + str]))]);
    }
    bs.unshift(new Node('('));
    return new List([new Node(html('span', { class: 'bracket' }, ['(', html('span', { class: 'bracket' }, defrag(unwrap(bs)))]))]);
  })));

function deepunwrap(list: List<Node<string | HTMLElement>>): boolean {
  let bottom = list.head!.value as HTMLElement;
  for (; bottom;) {
    const el = bottom.firstChild!.firstChild;
    if (el !== el?.parentNode?.lastChild) break;
    if (el instanceof HTMLElement === false) break;
    if (el?.className !== 'annotation') break;
    bottom = el;
  }
  const el = bottom.firstChild!.firstChild;
  if (el instanceof Element === false) return false;
  if (el === el?.parentNode?.lastChild) {
    const { className, firstChild, lastChild } = el;
    if (className === 'paren' || className === 'bracket') {
      firstChild!.nodeValue!.length === 1
        ? firstChild!.remove()
        : firstChild!.nodeValue = firstChild!.nodeValue!.slice(1);
      lastChild!.nodeValue!.length === 1
        ? lastChild!.remove()
        : lastChild!.nodeValue = lastChild!.nodeValue!.slice(0, -1);
      el.replaceWith(...el.childNodes);
      return true;
    }
  }
  return false;
}
