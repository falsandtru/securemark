import { parse } from '../syntax';
import { segment } from './segment';

export function bind(el: HTMLElement, source: string = ''): (source: string) => void {
  type Pair = [string, HTMLElement[]];
  const pairs: Pair[] = [];
  void segment(source)
    .reduce((el, s) => (
      void pairs.push([s, parse(s)]),
      void pairs[pairs.length - 1][1]
        .forEach(e =>
          void el.appendChild(e)),
      el
    ), el);
  return (source: string) => {
    const os = pairs.map(([s]) => s);
    const ns = segment(source);
    let i = 0;
    for (; i < os.length; ++i) {
      if (os[i] !== ns[i]) break;
    }
    let j = 0;
    for (; i + j < os.length && i + j < ns.length; ++j) {
      if (os[os.length - j - 1] !== ns[ns.length - j - 1]) break;
    }
    if (os.length === j && ns.length === j) return;
    void pairs.splice(i, os.length - j - i)
      .forEach(([, es]) =>
        void es
          .forEach(e =>
            void e.remove()));
    void pairs.splice(i, 0, ...ns.slice(i, ns.length - j).map<Pair>(s => [s, parse(s).reverse().map(e =>
      <HTMLElement>el.insertBefore(e, pairs.slice(i).reduce<HTMLElement | null>((e, [, es]) => e || es[0], null))
    ).reverse()]));
    return;
  };
}
