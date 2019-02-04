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
    const cs = pairs.map(([s]) => s);
    if (source === cs.join('')) return;
    const ns = segment(source);
    let i = 0;
    for (; i < cs.length; ++i) {
      if (cs[i] !== ns[i]) break;
    }
    assert(i <= cs.length);
    let j = 0;
    for (; i + j < cs.length && i + j < ns.length; ++j) {
      if (cs[cs.length - j - 1] !== ns[ns.length - j - 1]) break;
    }
    assert(j <= cs.length);
    assert(i + j <= cs.length);
    let ref = bottom(i) || target.firstChild;
    let k = i;
    for (const seg of ns.slice(i, ns.length - j)) {
      assert(revision === rev);
      const es = eval(block(seg));
      for (const [, es_] of pairs.splice(k, k < pairs.length - j ? 1 : 0, [seg, es])) {
        for (const el of es_) {
          ref = el.nextSibling;
          if (!el.parentNode) continue;
          void el.remove();
        }
      }
      assert(es.length < 2);
      for (const el of es) {
        assert(revision === rev);
        ref = target.insertBefore(el, ref).nextSibling;
        yield el;
        if (revision !== rev) throw new Error(`Reentered.`);
      }
      void ++k;
    }
    for (const [, es] of pairs.splice(k, pairs.length - k - j)) {
      for (const el of es) {
        if (!el.parentNode) continue;
        void el.remove();
      }
    }
    assert(revision === rev);
    assert(pairs.length === ns.length);
  };

  function bottom(index: number): Node | null {
    assert(index <= pairs.length);
    if (pairs.length === 0) return null;
    if (index === pairs.length) {
      const el = bottom(pairs.length - 1);
      return el && el.nextSibling;
    }
    for (; index >= 0 && index < pairs.length; --index) {
      const [, es] = pairs[index];
      for (let i = es.length - 1; i >= 0; --i) {
        const el = es[i];
        if (el.parentNode !== target) continue;
        return el;
      }
    }
    return null;
  }
}
