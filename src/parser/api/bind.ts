import { ParserConfigs } from '../../..';
import { eval } from '../../combinator';
import { segment } from '../segment';
import { block } from '../block';
import { normalize } from './normalization';
import { figure, footnote } from '../../util';

export function bind(target: DocumentFragment | HTMLElement | ShadowRoot, cfgs: ParserConfigs): (source: string) => Generator<HTMLElement, undefined, undefined> {
  type Pair = [string, readonly HTMLElement[]];
  const pairs: Pair[] = [];
  let revision: symbol;
  return function* (source: string): Generator<HTMLElement, undefined, undefined> {
    source = normalize(source);
    const rev = revision = Symbol();
    const targetSegments = pairs.map(([seg]) => seg);
    if (source === targetSegments.join('')) return;
    const sourceSegments = segment(source);
    let start = 0;
    for (; start < targetSegments.length; ++start) {
      if (targetSegments[start] !== sourceSegments[start]) break;
    }
    assert(start <= targetSegments.length);
    let end = 0;
    for (; start + end < targetSegments.length && start + end < sourceSegments.length; ++end) {
      if (targetSegments[targetSegments.length - end - 1] !== sourceSegments[sourceSegments.length - end - 1]) break;
    }
    assert(end <= targetSegments.length);
    assert(start + end <= targetSegments.length);
    let base: Node | null | undefined;
    let position = start;
    for (const segment of sourceSegments.slice(start, sourceSegments.length - end)) {
      assert(revision === rev);
      const skip = position < pairs.length && segment === pairs[position][0];
      const elements = skip
        ? pairs[position][1]
        : eval(block(segment, {}, {}));
      for (const [, es] of pairs.splice(position, position < pairs.length - end ? 1 : 0, [segment, elements])) {
        for (const el of es) {
          if (!el.parentNode) continue;
          assert(el.parentNode === target);
          assert(el === base || base === undefined);
          base = el.nextSibling;
          if (skip) continue;
          void el.remove();
        }
      }
      void ++position;
      if (skip) continue;
      base = base === undefined
        ? bottom(start, position) || target.firstChild
        : base;
      assert(elements.length < 2);
      for (const el of elements) {
        assert(revision === rev);
        base = target.insertBefore(el, base).nextSibling;
        yield el;
        if (revision !== rev) throw new Error(`Abort by reentering.`);
      }
    }
    for (const [, es] of pairs.splice(position, pairs.length - position - end)) {
      for (const el of es) {
        if (!el.parentNode) continue;
        assert(el.parentNode === target);
        void el.remove();
      }
    }
    assert(revision === rev);
    assert(pairs.length === sourceSegments.length);
    void figure(target);
    void footnote(target, cfgs.footnote);
  };

  function bottom(start: number, position: number): Node | null {
    assert(start <= pairs.length);
    if (pairs.length === 0) return null;
    if (start === pairs.length) return bottom(pairs.length - 1, position)?.nextSibling ?? null;
    for (let i = start; i >= 0 && i < pairs.length; --i) {
      const [, es] = pairs[i];
      for (let i = es.length - 1; i >= 0; --i) {
        const el = es[i];
        if (el.parentNode !== target) continue;
        return el.nextSibling;
      }
    }
    for (let i = position; i < pairs.length; ++i) {
      const [, es] = pairs[i];
      for (let i = 0; i < es.length; ++i) {
        const el = es[i];
        if (el.parentNode !== target) continue;
        return el;
      }
    }
    return null;
  }
}
