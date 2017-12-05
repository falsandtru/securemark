import { parse } from './parser';
import { segment } from '../parser/segment';

export function bind(el: HTMLElement | DocumentFragment): (source: string) => Iterable<HTMLElement> {
  assert(el.childNodes.length === 0);
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
    void pairs.splice(i, os.length - j - i)
      .forEach(([, es]) =>
        void es
          .forEach((e) =>
            void e.remove()));
    const ref = pairs.slice(i).reduce((e, [, es]) => e || es[0], null);
    const ps: Pair[] = [];
    for (const seg of ns.slice(i, ns.length - j)) {
      const es = [...parse(seg).children as HTMLCollectionOf<HTMLElement>]
        .map(e =>
          el.insertBefore(e, ref));
      void ps.push([seg, es]);
      assert(es.length <= 1);
      yield* es;
    }
    void pairs.splice(i, 0, ...ps);
    available = true;
  };
}
