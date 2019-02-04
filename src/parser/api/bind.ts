import { eval } from '../../combinator';
import { segment } from './segment';
import { block } from '../block';
import { normalize } from './normalization';

export function bind(target: DocumentFragment | HTMLElement): (source: string) => Iterable<HTMLElement> {
  type Pair = [string, readonly HTMLElement[]];
  const pairs: Pair[] = [];
  let revision: symbol;
  return function* (source: string): Iterable<HTMLElement> {
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
    let base = bottom(start) || target.firstChild;
    let position = start;
    for (const segment of sourceSegments.slice(start, sourceSegments.length - end)) {
      assert(revision === rev);
      const elements = eval(block(segment));
      for (const [, es] of pairs.splice(position, position < pairs.length - end ? 1 : 0, [segment, elements])) {
        for (const el of es) {
          if (!el.parentNode) continue;
          assert(el.parentNode === target);
          assert(el === base);
          base = el.nextSibling;
          void el.remove();
        }
      }
      assert(elements.length < 2);
      for (const el of elements) {
        assert(revision === rev);
        base = target.insertBefore(el, base).nextSibling;
        yield el;
        if (revision !== rev) throw new Error(`Reentered.`);
      }
      void ++position;
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
  };

  function bottom(start: number): Node | null {
    assert(start <= pairs.length);
    if (pairs.length === 0) return null;
    if (start === pairs.length) {
      const el = bottom(pairs.length - 1);
      return el && el.nextSibling;
    }
    for (let i = start; i >= 0 && i < pairs.length; --i) {
      const [, es] = pairs[i];
      for (let i = es.length - 1; i >= 0; --i) {
        const el = es[i];
        if (el.parentNode !== target) continue;
        return el;
      }
    }
    return null;
  }
}
