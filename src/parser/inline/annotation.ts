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
// 注釈を除外すると重複排除により参照元が消滅し欠番が生じるため少なくとも直接注釈は残す必要があるが間接注釈は
// 除外できる。しかしこれを効率的に行うことは難しいため最大再帰数を1回に制限することで間接注釈を行えない
// ようにするのが合理的だろう。
// 原理的には逆順処理により圧縮後正順で再附番すればすべて解決するはずだがテキストとシグネチャとハッシュも
// 修正する必要があるためほぼ完全な二重処理が必要になり三重以上の注釈という不適切な使用のために
// 常に非常に非効率な処理を行い常時低速化するより三重以上の注釈を禁止して効率性を維持するのが妥当である。
const MAX_DEPTH = 20;
export const annotation: AnnotationParser = lazy(() => constraint(State.annotation, surround(
  open('((', beforeNonblank),
  precedence(1, recursions([Recursion.annotation, Recursion.inline, Recursion.bracket, Recursion.bracket],
  some(union([inline]), ')', [[')', 1]]))),
  '))',
  false, [],
  ([, ns], context) => {
    const { linebreak, recursion, resources } = context;
    if (linebreak !== 0) {
      ns.unshift(new Node('('));
      ns.push(new Node(')'));
      return new List([new Node(html('span', { class: 'bracket' }, ['(', html('span', { class: 'bracket' }, defrag(unwrap(ns))), ')']))]);
    }
    const depth = MAX_DEPTH - (resources?.recursions[Recursion.annotation] ?? resources?.recursions.at(-1) ?? MAX_DEPTH);
    recursion.add(depth);
    return new List([new Node(html('sup', { class: 'annotation' }, [html('span', defrag(unwrap(trimBlankNodeEnd(ns))))]))]);
  },
  ([, bs], context) => {
    const { source, position, range, linebreak, recursion, resources } = context;
    const depth = MAX_DEPTH - (resources?.recursions[Recursion.annotation] ?? resources?.recursions.at(-1) ?? MAX_DEPTH);
    if (linebreak === 0 && bs && bs.length === 1 && source[position] === ')' && typeof bs.head?.value === 'object') {
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
    bs ??= new List();
    bs.unshift(new Node('('));
    if (source[context.position] === ')') {
      bs.push(new Node(')'));
      context.position += 1;
    }
    const str = linebreak === 0 ? source.slice(position - range + 2, position) : '';
    bs = linebreak === 0 && (str === '' || indexA.test(str))
      ? new List([new Node(html('span', { class: 'paren' }, defrag(unwrap(bs))))])
      : new List([new Node(html('span', { class: 'bracket' }, defrag(unwrap(bs))))]);
    bs.unshift(new Node('('));
    const cs = parser(context);
    if (source[context.position] === ')') {
      cs && bs.import(cs);
      bs.push(new Node(')'));
      context.position += 1;
    }
    return new List([new Node(html('span', { class: 'bracket' }, defrag(unwrap(bs))))]);
  })));

const parser = lazy(() => precedence(1, some(inline, ')', [[')', 1]])));

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
