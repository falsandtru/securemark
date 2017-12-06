import { parse_ } from './parser';
import { segment } from '../parser/segment';
import { concat } from 'spica/concat';

export function bind(target: HTMLElement | DocumentFragment): (source: string) => Iterable<HTMLElement> {
  assert(target.childNodes.length === 0);
  type Pair = [string, HTMLElement[]];
  const pairs: Pair[] = [];
  let available = true;
  return function* (source: string): Iterable<HTMLElement> {
    if (!available) throw new Error('Securemark: Previous parse iteration is not done.');
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
    available = false;
    for (const [, es] of pairs.splice(i, pairs.length - j - i)) {
      for (const el of es) {
        void el.remove();
      }
    }
    const ps: Pair[] = [];
    const [, [ref = null] = []] = pairs.slice(i).find(([, [el]]) => !!el) || [];
    for (const seg of ns.slice(i, ns.length - j)) {
      const es = parse_(seg)
        .reduce((acc, el) =>
          (void target.insertBefore(el, ref), concat(acc, [el]))
        , []);
      void ps.push([seg, es]);
      yield* es;
    }
    void pairs.splice(i, 0, ...ps);
    available = true;
  };
}
