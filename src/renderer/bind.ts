import { parse_ } from './parser';
import { segment } from '../parser/segment';

export function bind(target: HTMLElement | DocumentFragment): (source: string) => Iterable<HTMLElement> {
  assert(target.childNodes.length === 0);
  type Pair = [string, HTMLElement[]];
  const pairs: Pair[] = [];
  let revision: {} = [];
  return function* (source: string): Iterable<HTMLElement> {
    const rev = revision = [];
    const os = pairs.map(([s]) => s);
    if (source === os.join('')) return;
    const ns = segment(source);
    let i = 0;
    for (; i < os.length; ++i) {
      if (os[i] !== ns[i]) break;
    }
    let j = 0;
    for (; i + j < os.length && i + j < ns.length; ++j) {
      if (os[os.length - j - 1] !== ns[ns.length - j - 1]) break;
    }
    for (const [, es] of pairs.splice(i, pairs.length - j - i)) {
      for (const el of es) {
        void el.remove();
      }
    }
    const [, [ref = null] = []] = pairs.slice(i).find(([, [el]]) => !!el) || [];
    for (const [seg, k] of ns.slice(i, ns.length - j).map<[string, number]>((seg, k) => [seg, i + k])) {
      const es = parse_(seg);
      void es.forEach(el =>
        void target.insertBefore(el, ref));
      void pairs.splice(k, 0, [seg, es]);
      yield* es;
      if (revision !== rev) return;
    }
  };
}
