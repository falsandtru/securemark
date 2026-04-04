import { ParserSettings, Progress } from '../..';
import { Input, Options, Segment } from '../parser/context';
import { Output, run } from '../combinator/parser';
import { segment } from '../parser/segment';
import { block } from '../parser/block';
import { headers } from './header';
import { figure } from '../processor/figure';
import { note } from '../processor/note';
import { ReadonlyURL } from 'spica/url';
import { splice } from 'spica/array';

interface Settings extends ParserSettings {
}

export function bind(target: DocumentFragment | HTMLElement | ShadowRoot, settings: Settings): {
  parse: (source: string) => Generator<Progress, undefined, undefined>;
  nearest: (position: number) => HTMLElement | undefined;
  index: (block: HTMLElement) => number;
} {
  const options: Options = {
    ...settings,
    host: settings.host ?? new ReadonlyURL(location.pathname, location.origin),
    header: true,
  };
  if (options.id?.match(/[^0-9a-z/-]/i)) throw new Error('Invalid ID: ID must be alphanumeric');
  if (options.host?.origin === 'null') throw new Error(`Invalid host: ${options.host.href}`);
  type Block = readonly [segment: string, blocks: readonly HTMLElement[], url: string];
  const blocks: Block[] = [];
  const adds: (readonly [HTMLElement, global.Node | null])[] = [];
  const dels: (readonly [HTMLElement])[] = [];
  const bottom = target.firstChild;
  let revision: symbol | undefined;
  return {
    parse,
    nearest,
    index,
  };

  function* parse(source: string): Generator<Progress, undefined, undefined> {
    if (settings.chunk && revision) throw new Error('Chunks cannot be updated');
    const url = headers(source).find(field => field.toLowerCase().startsWith('url:'))?.slice(4).trim() ?? '';
    // @ts-expect-error
    options.url = url ? new ReadonlyURL(url as ':') : undefined;
    const rev = revision = Symbol();
    const sourceSegments: string[] = [];
    const sourceSegmentAttrs: Segment[] = [];
    for (const [seg, attr] of segment(source)) {
      sourceSegments.push(seg);
      sourceSegmentAttrs.push(attr);
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
    const output = new Output<HTMLElement>();
    const base = next(head);
    let index = head;
    options.header = true;
    for (; index < sourceSegments.length - last; ++index) {
      assert(rev === revision);
      const seg = sourceSegments[index];
      options.segment = sourceSegmentAttrs[index] | Segment.write;
      for (const _ of run(block, new Input(options, seg), output)) {
        yield { type: 'break', value: 'block' };
      }
      assert(output.data.length === 1);
      const es = output.pop()
        .foldl<HTMLElement[]>((acc, { value }) => (acc.push(value), acc), []);
      output.push();
      options.header &&= false;
      blocks.length === index
        ? blocks.push([seg, es, url])
        : blocks.splice(index, 0, [seg, es, url]);
      if (es.length === 0) continue;
      // All deletion processes always run after all addition processes have done.
      // Therefore any `base` node will never be unavailable by deletions until all the dependent `el` nodes are added.
      adds.push(...es.map(el => [el, base] as const));
      adds.reverse();
      for (; adds.length > 0;) {
        assert(rev === revision);
        const [el, base] = adds.pop()!;
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
      dels.push(...es.map(el => [el] as const));
    }
    assert(blocks.length === sourceSegments.length);
    adds.reverse();
    for (; adds.length > 0;) {
      assert(rev === revision);
      const [el, base] = adds.pop()!;
      target.insertBefore(el, base);
      assert(el.parentNode);
      yield { type: 'block', value: el };
      if (rev !== revision) return yield { type: 'cancel' };
    }
    dels.reverse();
    for (; dels.length > 0;) {
      assert(rev === revision);
      const [el] = dels.pop()!;
      el.parentNode?.removeChild(el);
      assert(!el.parentNode);
      yield { type: 'block', value: el };
      if (rev !== revision) return yield { type: 'cancel' };
    }
    yield { type: 'break', value: 'parser' };
    if (rev !== revision) return yield { type: 'cancel' };
    for (const el of figure(next(0)?.parentNode ?? target, settings.notes, options)) {
      assert(rev === revision);
      el
        ? yield { type: 'figure', value: el }
        : yield { type: 'break', value: 'figure' };
      if (rev !== revision) return yield { type: 'cancel' };
    }
    for (const el of note(next(0)?.parentNode ?? target, settings.notes, options, bottom)) {
      assert(rev === revision);
      el
        ? yield { type: 'note', value: el }
        : yield { type: 'break', value: 'note' };
      if (rev !== revision) return yield { type: 'cancel' };
    }
  }

  function next(index: number): global.Node | null {
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
    for (let len = 0, i = 0; i < blocks.length; ++i) {
      const block = blocks[i];
      len += block[0].length;
      el = block[1][0] ?? el;
      if (len >= index) break;
    }
    return el;
  }

  function index(source: HTMLElement): number {
    for (let len = 0, i = 0; i < blocks.length; ++i) {
      const block = blocks[i];
      if (block[1].includes(source)) return len;
      len += block[0].length;
    }
    return -1;
  }
}
