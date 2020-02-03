import { ParserSettings } from '../../..';
import { eval } from '../../combinator';
import { segment } from '../segment';
import { block } from '../block';
import { normalize } from './normalize';
import { figure } from '../../util/figure';
import { footnote } from '../../util/footnote';

export function bind(target: DocumentFragment | HTMLElement | ShadowRoot, stgs: ParserSettings): (source: string) => Generator<HTMLElement | undefined, undefined, undefined> {
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
    let start = 0;
    for (; start < targetSegments.length; ++start) {
      if (targetSegments[start] !== sourceSegments[start]) break;
    }
    assert(start <= targetSegments.length);
    if (adds.length + dels.length === 0 && sourceSegments.length === targetSegments.length && start === sourceSegments.length) return;
    let end = 0;
    for (; start + end < targetSegments.length && start + end < sourceSegments.length; ++end) {
      if (targetSegments[targetSegments.length - end - 1] !== sourceSegments[sourceSegments.length - end - 1]) break;
    }
    assert(end <= targetSegments.length);
    assert(start + end <= targetSegments.length);
    const base = next(start);
    let index = start;
    for (; index < sourceSegments.length - end; ++index) {
      assert(rev === revision);
      const seg = sourceSegments[index];
      const es = eval(block(seg, {}));
      void pairs.splice(index, 0, [seg, es]);
      if (es.length === 0) continue;
      // All deletion processes always run after all addition processes have done.
      // Therefore any `base` node will never be unavailable by deletions until all the dependent `el` nodes are added.
      void adds.push(...es.map<typeof adds[number]>(el => [el, base]));
      while (adds.length > 0) {
        assert(rev === revision);
        const [el, base] = adds.shift()!;
        void target.insertBefore(el, base);
        assert(el.parentNode);
        yield el;
        if (rev !== revision) return yield;
      }
    }
    for (const [, es] of pairs.splice(index, pairs.length - sourceSegments.length)) {
      assert(rev === revision);
      if (es.length === 0) continue;
      void dels.push(...es);
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
    for (const el of figure(target)) {
      assert(rev === revision);
      yield el;
      if (rev !== revision) return yield;
    }
    for (const el of footnote(target, stgs.footnotes)) {
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
