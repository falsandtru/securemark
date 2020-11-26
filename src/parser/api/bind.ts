import { location } from 'spica/global';
import { ParserSettings, Result } from '../../..';
import { eval } from '../../combinator';
import { segment } from '../segment';
import { header as h } from '../api/header';
import { header } from '../header';
import { block } from '../block';
import { normalize } from './normalize';
import { figure } from '../../util/figure';
import { footnote } from '../../util/footnote';
import { push, splice } from 'spica/array';
import { ReadonlyURL } from 'spica/url';

interface Settings extends ParserSettings {
  readonly url?: URL;
}

export function bind(target: DocumentFragment | HTMLElement | ShadowRoot, settings: Settings): (source: string) => Generator<Result, undefined, undefined> {
  settings = settings.origin ? settings : { ...settings, origin: location.href };
  assert(!settings.id);
  assert(Object.freeze(settings));
  type Pair = readonly [string, readonly HTMLElement[]];
  const pairs: Pair[] = [];
  const adds: [HTMLElement, Node | null][] = [];
  const dels: HTMLElement[] = [];
  const bottom = target.firstChild;
  let revision: symbol;
  return function* (source: string): Generator<Result, undefined, undefined> {
    const rev = revision = Symbol();
    const url = h(source)?.find(s => s.startsWith('url: '))?.slice(5).trim();
    settings = url ? { ...settings, url: new ReadonlyURL(url, settings.origin) } : settings;
    assert(Object.freeze(settings));
    source = normalize(source);
    const sourceSegments: string[] = [];
    for (const seg of segment(source)) {
      sourceSegments.push(seg);
      yield { type: 'segment', value: seg };
    }
    const targetSegments = pairs.map(([seg]) => seg);
    let head = 0;
    for (; head < targetSegments.length; ++head) {
      if (targetSegments[head] !== sourceSegments[head]) break;
    }
    assert(head <= targetSegments.length);
    if (adds.length + dels.length === 0 && sourceSegments.length === targetSegments.length && head === sourceSegments.length) return;
    let last = 0;
    for (; head + last < targetSegments.length && head + last < sourceSegments.length; ++last) {
      if (targetSegments[targetSegments.length - last - 1] !== sourceSegments[sourceSegments.length - last - 1]) break;
    }
    assert(last <= targetSegments.length);
    assert(head + last <= targetSegments.length);
    const base = next(head);
    let index = head;
    for (; index < sourceSegments.length - last; ++index) {
      assert(rev === revision);
      const seg = sourceSegments[index];
      const es = eval(
        index === 0
        && header(seg, settings)
        || block(seg, settings),
        []);
      pairs.splice(index, 0, [seg, es]);
      if (es.length === 0) continue;
      // All deletion processes always run after all addition processes have done.
      // Therefore any `base` node will never be unavailable by deletions until all the dependent `el` nodes are added.
      push(adds, es.map<typeof adds[number]>(el => [el, base]));
      while (adds.length > 0) {
        assert(rev === revision);
        const [el, base] = adds.shift()!;
        target.insertBefore(el, base);
        assert(el.parentNode);
        yield { type: 'block', value: el };
        if (rev !== revision) return yield { type: 'cancel' };
      }
    }
    for (let refuse = splice(pairs, index, pairs.length - sourceSegments.length), i = 0; i < refuse.length; ++i) {
      assert(rev === revision);
      const es = refuse[i][1];
      if (es.length === 0) continue;
      push(dels, es);
    }
    assert(pairs.length === sourceSegments.length);
    while (adds.length > 0) {
      assert(rev === revision);
      const [el, base] = adds.shift()!;
      target.insertBefore(el, base);
      assert(el.parentNode);
      yield { type: 'block', value: el };
      if (rev !== revision) return yield { type: 'cancel' };
    }
    while (dels.length > 0) {
      assert(rev === revision);
      const el = dels.shift()!;
      el.parentNode?.removeChild(el);
      assert(!el.parentNode);
      yield { type: 'block', value: el };
      if (rev !== revision) return yield { type: 'cancel' };
    }
    for (const el of footnote(target, settings.footnotes, settings)) {
      assert(rev === revision);
      el
        ? yield { type: 'footnote', value: el }
        : yield { type: 'break' };
      if (rev !== revision) return yield { type: 'cancel' };
    }
    for (const el of figure(target, settings.footnotes, settings)) {
      assert(rev === revision);
      el
        ? yield { type: 'figure', value: el }
        : yield { type: 'break' };
      if (rev !== revision) return yield { type: 'cancel' };
    }
  };

  function next(index: number): Node | null {
    assert(index >= 0);
    assert(index <= pairs.length);
    for (let i = index; i < pairs.length; ++i) {
      const [, es] = pairs[i];
      if (es.length > 0) return es[0];
    }
    return bottom;
  }
}
