import { parse_ } from './parser';
import { segment } from '../parser/segment';

export function bind(target: HTMLElement | DocumentFragment): (source: string) => Iterable<HTMLElement> {
  assert(target.childNodes.length === 0);
  type Pair = [string, HTMLElement[]];
  const pairs: Pair[] = [];
  let revision: object = [];
  return function* (source: string): Iterable<HTMLElement> {
    const rev = revision = [];
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
    const [, [ref = null] = []] = pairs.slice(i).find(([, [el]]) => !!el) || [];
    for (const [seg, k] of ns.slice(i, ns.length - j).map<[string, number]>((seg, k) => [seg, i + k])) {
      const es = parse_(seg);
      void pairs.splice(k, 0, [seg, es]);
      void es
        .forEach(el =>
          void target.insertBefore(el, ref));
      yield* es;
      if (revision !== rev) return;
    }
    assert(revision === rev);
  };
}
