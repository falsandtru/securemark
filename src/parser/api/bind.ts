import { eval } from '../../combinator';
import { segment } from './segment';
import { block } from '../block';

export function bind(target: DocumentFragment | HTMLElement): (source: string) => Iterable<HTMLElement> {
  type Pair = [string, HTMLElement[]];
  const pairs: Pair[] = [];
  let revision: symbol;
  return function* (source: string): Iterable<HTMLElement> {
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
    void pairs.splice(i, pairs.length - j - i)
      .forEach(([, es]) =>
        void es
          .forEach(el =>
            void el.remove()));
    const [, [ref = bottom()] = []] = pairs.slice(i).find(([, [el]]) => !!el) || [];
    for (const [seg, k] of ns.slice(i, ns.length - j).map<[string, number]>((seg, k) => [seg, i + k])) {
      assert(revision === rev);
      const es = eval(block(seg));
      void pairs.splice(k, 0, [seg, es]);
      assert(es.length < 2);
      for (const el of es) {
        assert(revision === rev);
        void target.insertBefore(el, ref);
        yield el;
        if (revision !== rev) return;
      }
    }
    assert(revision === rev);
  };

  function bottom(): Node | null {
    if (pairs.length === 0) return target.firstChild;
    for (let i = pairs.length - 1; i >= 0; --i) {
      const [, es] = pairs[i];
      if (es.length === 0) continue;
      return es[es.length - 1].nextSibling;
    }
    return target.firstChild;
  }
}
