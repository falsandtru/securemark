import { undefined, location } from 'spica/global';
import { ObjectAssign } from 'spica/alias';
import { ParserSettings, Progress } from '../../..';
import { MarkdownParser } from '../../../markdown';
import { eval } from '../../combinator/data/parser';
import { header } from '../header';
import { block } from '../block';
import { segment } from '../segment';
import { normalize } from './normalize';
import { headers } from './header';
import { figure } from '../function/figure';
import { footnote } from '../function/footnote';
import { ReadonlyURL } from 'spica/url';
import { push, splice } from 'spica/array';

interface Settings extends ParserSettings {
}

export function bind(target: DocumentFragment | HTMLElement | ShadowRoot, settings: Settings): {
  parse: (source: string) => Generator<Progress, undefined, undefined>;
  nearest: (position: number) => HTMLElement | undefined;
  index: (block: HTMLElement) => number;
} {
  let context: MarkdownParser.Context = ObjectAssign({}, settings, {
    host: settings.host ?? new ReadonlyURL(location.pathname, location.origin),
    footnotes: undefined,
    chunk: undefined,
  });
  if (context.host?.origin === 'null') throw new Error(`Invalid host: ${context.host.href}`);
  assert(!settings.id);
  type Block = readonly [segment: string, blocks: readonly HTMLElement[], url: string];
  const blocks: Block[] = [];
  const adds: [HTMLElement, Node | null][] = [];
  const dels: [HTMLElement][] = [];
  const bottom = target.firstChild;
  let revision: symbol | undefined;
  return {
    parse,
    nearest,
    index,
  };

  function* parse(source: string): Generator<Progress, undefined, undefined> {
    if (settings.chunk && revision) throw new Error('Chunks cannot be updated.');
    const rev = revision = Symbol();
    const url = headers(source).find(field => field.toLowerCase().startsWith('url:'))?.slice(4).trim() || '';
    context = ObjectAssign(context, { url: url ? new ReadonlyURL(url) : undefined });
    const sourceSegments: string[] = [];
    for (const seg of segment(normalize(source))) {
      sourceSegments.push(seg);
      yield { type: 'segment', value: seg };
    }
    const targetSegments = blocks.map(([seg]) => seg);
    let head = 0;
    for (; head < targetSegments.length; ++head) {
      assert(head < blocks.length);
      if (blocks[head][2] !== url) break;
      if (targetSegments[head] !== sourceSegments[head]) break;
    }
    assert(head <= targetSegments.length);
    if (adds.length + dels.length === 0 && sourceSegments.length === targetSegments.length && head === sourceSegments.length) return;
    let last = 0;
    for (; head + last < targetSegments.length && head + last < sourceSegments.length; ++last) {
      assert(targetSegments.length - last - 1 < blocks.length);
      if (blocks[targetSegments.length - last - 1][2] !== url) break;
      if (targetSegments[targetSegments.length - last - 1] !== sourceSegments[sourceSegments.length - last - 1]) break;
    }
    assert(last <= targetSegments.length);
    assert(head + last <= targetSegments.length);
    const base = next(head);
    let index = head;
    for (; index < sourceSegments.length - last; ++index) {
      assert(rev === revision);
      const seg = sourceSegments[index];
      const es = eval(index === 0 && header(seg, context) || block(seg, context), []);
      blocks.splice(index, 0, [seg, es, url]);
      if (es.length === 0) continue;
      // All deletion processes always run after all addition processes have done.
      // Therefore any `base` node will never be unavailable by deletions until all the dependent `el` nodes are added.
      push(adds, es.map(el => [el, base] as const));
      while (adds.length > 0) {
        assert(rev === revision);
        const [el, base] = adds.shift()!;
        target.insertBefore(el, base);
        assert(el.parentNode);
        yield { type: 'block', value: el };
        if (rev !== revision) return yield { type: 'cancel' };
      }
    }
    for (let refuse = splice(blocks, index, blocks.length - sourceSegments.length), i = 0; i < refuse.length; ++i) {
      assert(rev === revision);
      const es = refuse[i][1];
      if (es.length === 0) continue;
      push(dels, es.map(el => [el]));
    }
    assert(blocks.length === sourceSegments.length);
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
      const [el] = dels.shift()!;
      el.parentNode?.removeChild(el);
      assert(!el.parentNode);
      yield { type: 'block', value: el };
      if (rev !== revision) return yield { type: 'cancel' };
    }
    for (const el of footnote(next(0)?.parentNode || target, settings.footnotes, context)) {
      assert(rev === revision);
      el
        ? yield { type: 'footnote', value: el }
        : yield { type: 'break' };
      if (rev !== revision) return yield { type: 'cancel' };
    }
    for (const el of figure(next(0)?.parentNode || target, settings.footnotes, context)) {
      assert(rev === revision);
      el
        ? yield { type: 'figure', value: el }
        : yield { type: 'break' };
      if (rev !== revision) return yield { type: 'cancel' };
    }
  }

  function next(index: number): Node | null {
    assert(index >= 0);
    assert(index <= blocks.length);
    for (let i = index; i < blocks.length; ++i) {
      const [, es] = blocks[i];
      if (es.length > 0) return es[0];
    }
    return bottom;
  }

  function nearest(index: number): HTMLElement | undefined {
    let el: HTMLElement | undefined;
    let len = 0;
    for (let i = 0; i < blocks.length; ++i) {
      const block = blocks[i];
      len += block[0].length;
      el = block[1][0] || el;
      if (len >= index) break;
    }
    return el;
  }

  function index(source: HTMLElement): number {
    let len = 0;
    for (let i = 0; i < blocks.length; ++i) {
      const block = blocks[i];
      if (block[1].includes(source)) return len;
      len += block[0].length;
    }
    return -1;
  }
}
