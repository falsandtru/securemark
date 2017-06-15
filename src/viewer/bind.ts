import { parse } from '../parser';
import { segment } from '../parser/segment';

export function bind(node: Node): (source: string) => HTMLElement[] {
  assert(node.childNodes.length === 0);
  type Pair = [string, HTMLElement[]];
  const pairs: Pair[] = [];
  return (source: string) => {
    const os = pairs.map(([s]) => s);
    if (source === os.join('')) return [];
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
          .forEach(e =>
            void e.remove()));
    const ref = pairs.slice(i).reduce<HTMLElement | null>((e, [, es]) => e || es[0], null);
    const ps = ns.slice(i, ns.length - j)
      .map<Pair>(s =>
        [
          s,
          Array.from(parse(s).childNodes)
            .map(e =>
              <HTMLElement>node.insertBefore(e, ref))
        ]);
    void pairs.splice(i, 0, ...ps);
    return ps
      .reduce<HTMLElement[]>((acc, [, es]) => acc.concat(es), []);
  };
}
