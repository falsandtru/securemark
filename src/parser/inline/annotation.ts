import { AnnotationParser } from '../inline';
import { State, Recursion, Command } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, precedence, constraint, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { bracketname } from './bracket';
import { repeat } from '../repeat';
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
export const annotation: AnnotationParser = lazy(() => constraint(State.annotation,
  repeat('(', beforeNonblank, ')', [Recursion.bracket], precedence(1, surround(
    '',
    some(union([inline]), ')', [[')', 1]]),
    ')',
    false, [],
    ([, bs], { buffer }) => buffer.import(bs),
    ([, bs], { buffer }) => bs && buffer.import(bs).push(new Node(Command.Cancel)) && buffer)),
    (nodes, context, lead, follow) => {
      const { linebreak, recursion, resources } = context;
      if (linebreak !== 0 || nodes.length === 0 || lead === 0 || follow % 2 === 0) {
        nodes.unshift(new Node('('));
        nodes.push(new Node(')'));
        return new List([
          new Node(html('span', { class: bracketname(context, 1, 1) }, defrag(unwrap(nodes))))
        ]);
      }
      recursion.add(MAX_DEPTH - (resources?.recursions[Recursion.bracket] ?? resources?.recursions.at(-1) ?? MAX_DEPTH));
      context.position += 1;
      return new List([
        new Node(html('sup', { class: 'annotation' }, [html('span', defrag(unwrap(trimBlankNodeEnd(nodes))))]))
      ]);
    },
    (nodes, context, prefix, postfix) => {
      assert(postfix === 0);
      for (let i = 0; i < prefix; ++i) {
        nodes.unshift(new Node('('));
        nodes = new List([new Node(html('span', { class: bracketname(context, 1, 0) }, defrag(unwrap(nodes))))]);
        context.range += 1;
      }
      return nodes;
    })));
