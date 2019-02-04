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
    let j = 0;
    for (; i + j < cs.length && i + j < ns.length; ++j) {
      if (cs[cs.length - j - 1] !== ns[ns.length - j - 1]) break;
    }
    const [, [ref = bottom()] = []] = pairs.slice(pairs.length - j)
      .find(([, [el = undefined]]) => !!el && !!el.parentNode) || [];
    for (const [, es] of pairs.splice(i, pairs.length - j - i)) {
      for (const el of es) {
        if (el.parentNode !== target) continue;
        void target.removeChild(el);
      }
    }
    let k = i;
    for (const seg of ns.slice(i, ns.length - j)) {
      assert(revision === rev);
      const es = eval(block(seg));
      void pairs.splice(k, 0, [seg, es]);
      assert(es.length < 2);
      for (const el of es) {
        assert(revision === rev);
        void target.insertBefore(el, ref);
        yield el;
        if (revision !== rev) throw new Error(`Reentered.`);
      }
      void ++k;
    }
    assert(revision === rev);
    assert(pairs.length === ns.length);
  };

  function bottom(): Node | null {
    for (let i = pairs.length - 1; i >= 0 && i < pairs.length; --i) {
      const [, es] = pairs[i];
      for (let j = es.length - 1; j >= 0; --j) {
        const el = es[j];
        if (el.parentNode === target) return el.nextSibling;
      }
    }
    return target.firstChild;
  }
}
