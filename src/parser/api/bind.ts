import { ParserSettings } from '../../..';
import { eval } from '../../combinator';
import { segment } from '../segment';
import { block } from '../block';
import { normalize } from './normalize';
import { figure } from '../../util/figure';
import { footnote } from '../../util/footnote';
import { push, splice } from 'spica/array';

export function bind(target: DocumentFragment | HTMLElement | ShadowRoot, settings: ParserSettings): (source: string) => Generator<HTMLElement | undefined, undefined, undefined> {
  type Pair = readonly [string, readonly HTMLElement[]];
  const pairs: Pair[] = [];
  const adds: [HTMLElement, Node | null][] = [];
  const dels: HTMLElement[] = [];
  const bottom = target.firstChild;
  let revision: symbol;
  return function* (source: string): Generator<HTMLElement | undefined, undefined, undefined> {
    const rev = revision = Symbol();
    source = normalize(source);
    const sourceSegments = segment(source);
    const targetSegments = pairs.map(([seg]) => seg);
    let head = 0;
    for (; head < targetSegments.length; ++head) {
      if (targetSegments[head] !== sourceSegments[head]) break;
    }
    assert(head <= targetSegments.length);
    if (adds.length + dels.length === 0 && sourceSegments.length === targetSegments.length && head === sourceSegments.length) return;
    let last = 0;
    for (; head + last < targetSegments.length && head + last < sourceSegments.length; ++last) {
      if (targetSegments[targetSegments.length - last - 1] !== sourceSegments[sourceSegments.length - last - 1]) break;
    }
    assert(last <= targetSegments.length);
    assert(head + last <= targetSegments.length);
    const base = next(head);
    let index = head;
    for (; index < sourceSegments.length - last; ++index) {
      assert(rev === revision);
      const seg = sourceSegments[index];
      const es = eval(block(seg, settings), []);
      void pairs.splice(index, 0, [seg, es]);
      if (es.length === 0) continue;
      // All deletion processes always run after all addition processes have done.
      // Therefore any `base` node will never be unavailable by deletions until all the dependent `el` nodes are added.
      void push(adds, es.map<typeof adds[number]>(el => [el, base]));
      while (adds.length > 0) {
        assert(rev === revision);
        const [el, base] = adds.shift()!;
        void target.insertBefore(el, base);
        assert(el.parentNode);
        yield el;
        if (rev !== revision) return yield;
      }
    }
    for (let refuse = splice(pairs, index, pairs.length - sourceSegments.length), i = 0; i < refuse.length; ++i) {
      assert(rev === revision);
      const es = refuse[i][1];
      if (es.length === 0) continue;
      void push(dels, es);
    }
    assert(pairs.length === sourceSegments.length);
    while (adds.length > 0) {
      assert(rev === revision);
      const [el, base] = adds.shift()!;
      void target.insertBefore(el, base);
      assert(el.parentNode);
      yield el;
      if (rev !== revision) return yield;
    }
    while (dels.length > 0) {
      assert(rev === revision);
      const el = dels.shift()!;
      void el.parentNode?.removeChild(el);
      assert(!el.parentNode);
      yield el;
      if (rev !== revision) return yield;
    }
    for (const el of footnote(target, settings.footnotes)) {
      assert(rev === revision);
      yield el;
      if (rev !== revision) return yield;
    }
    for (const el of figure(target, settings.footnotes)) {
      assert(rev === revision);
      yield el;
      if (rev !== revision) return yield;
    }
  };

  function next(index: number): Node | null {
    assert(index >= 0);
    assert(index <= pairs.length);
    for (let i = index; i < pairs.length; ++i) {
      const [, es] = pairs[i];
      if (es.length > 0) return es[0];
    }
    return bottom;
  }
}
