import { ParserConfigs } from '../../..';
import { eval } from '../../combinator';
import { segment } from '../segment';
import { block } from '../block';
import { normalize } from './normalization';
import { figure, footnote } from '../../util';

export function bind(target: DocumentFragment | HTMLElement | ShadowRoot, cfgs: ParserConfigs): (source: string) => Generator<HTMLElement, undefined, undefined> {
  type Pair = readonly [string, readonly HTMLElement[]];
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
    let index = start;
    let base: Node | null | undefined = next(index);
    for (const segment of sourceSegments.slice(start, sourceSegments.length - end)) {
      assert(revision === rev);
      const skip = index < pairs.length && segment === pairs[index][0];
      const elements = skip
        ? pairs[index][1]
        : eval(block(segment, {}));
      for (const [, es] of pairs.splice(index, index < pairs.length - end ? 1 : 0, [segment, elements])) {
        for (const el of es) {
          assert(el === base);
          base = el.parentNode === target
            ? el.nextSibling
            : base;
          if (skip) continue;
          el.parentNode && void el.remove();
          assert(!el.parentNode);
          yield el;
        }
      }
      void ++index;
      if (skip) continue;
      assert(elements.length < 2);
      for (const el of elements) {
        assert(revision === rev);
        base = target.insertBefore(el, base).nextSibling;
        assert(el.parentNode);
        yield el;
        if (revision !== rev) throw new Error(`Abort by reentering.`);
      }
    }
    for (const [, es] of pairs.splice(index, pairs.length - index - end)) {
      for (const el of es) {
        el.parentNode && void el.remove();
        assert(!el.parentNode);
        yield el;
      }
    }
    assert(revision === rev);
    assert(pairs.length === sourceSegments.length);
    void figure(target);
    void footnote(target, cfgs.footnote);
  };

  function next(index: number): Node | null {
    assert(index >= 0);
    assert(index <= pairs.length);
    for (let i = index; i-- && i < pairs.length;) {
      const [, es] = pairs[i];
      for (let i = es.length; i--;) {
        const el = es[i];
        if (el.parentNode !== target) continue;
        return el.nextSibling;
      }
    }
    for (let i = index; i < pairs.length; ++i) {
      const [, es] = pairs[i];
      for (let i = 0; i < es.length; ++i) {
        const el = es[i];
        if (el.parentNode !== target) continue;
        return el;
      }
    }
    return target.firstChild;
  }
}
