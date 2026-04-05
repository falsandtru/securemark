import { List, Node } from '../combinator/parser';
import { identity, signature, text } from '../parser/inline/extension/indexee';
import { markInvalid, unmarkInvalid, collect } from '../parser/util';
import { memoize } from 'spica/memoize';
import { html, define } from 'typed-dom/dom';

export function* note(
  target: ParentNode & global.Node,
  lists: {
    readonly annotations: List<Node<HTMLElement>>;
    readonly references: List<Node<HTMLElement>>;
  },
  notes?: {
    readonly annotations?: HTMLOListElement;
    readonly references: HTMLOListElement;
  },
  opts: {
    readonly id?: string;
    readonly local?: boolean;
  } = {},
  bottom: global.Node | null = null,
): Generator<HTMLOListElement | undefined, undefined, undefined> {
  const referenceRefMemory = referenceRefsMemoryCaller(target);
  const annotationRefMemory = annotationRefsMemoryCaller(target);
  for (const memory of [referenceRefMemory, annotationRefMemory]) {
    for (const [ref, { content }] of memory) {
      ref.replaceChildren(content);
    }
    memory.clear();
  }
  yield* reference(
    referenceRefMemory,
    target,
    lists.references.foldl<HTMLElement[]>((acc, { value: el }) =>
      (acc.push(el), acc), []),
    notes?.references, opts, bottom);
  yield* annotation(
    annotationRefMemory,
    target,
    lists.annotations.foldl<HTMLElement[]>((acc, { value: el }) =>
      (acc.push(el), acc), []),
    notes?.annotations, opts, bottom);
}

interface RefMemory {
  readonly content: Element;
  readonly identifier: string;
  readonly abbr: string;
  readonly text: string;
}

const annotationRefsMemoryCaller = memoize((target: global.Node) =>
  new Map<HTMLElement, RefMemory>() ?? target,
  new WeakMap());

const referenceRefsMemoryCaller = memoize((target: global.Node) =>
  new Map<HTMLElement, {
    readonly content: Element;
    readonly identifier: string;
    readonly abbr: string;
    readonly text: string;
  }>() ?? target,
  new WeakMap());

const annotation = build(
  'annotation',
  'annotations',
  n => `*${n}`,
  'h1, h2, h3, h4, h5, h6, aside.aside, hr, .references');
const reference = build(
  'reference',
  'references',
  (n, abbr) => `[${abbr || n}]`);

function build(
  syntax: string,
  list: string,
  marker: (index: number, abbr: string) => string,
  splitter: string = '',
) {
  assert(syntax.match(/^[a-z]+$/));
  splitter &&= `${splitter}, .${list}`;
  return function* (
    memory: Map<HTMLElement, RefMemory>,
    target: ParentNode & global.Node,
    refs: readonly HTMLElement[],
    note?: HTMLOListElement,
    opts: {
      readonly id?: string;
      readonly local?: boolean;
    } = {},
    bottom: global.Node | null = null,
  ): Generator<HTMLOListElement | undefined, undefined, undefined> {
    const refInfoCaller = memoize((ref: HTMLElement) => {
      const content = ref.firstElementChild!;
      const abbr = ref.getAttribute('data-abbr') ?? '';
      const clone = ref.cloneNode(true);
      const txt = text(clone).trim();
      const identifier = abbr
        ? identity(
            '',
            undefined,
            (
              abbr.match(/^(?:\S+ )+?(?:(?:January|February|March|April|May|June|August|September|October|November|December) \d{1,2}(?:-\d{0,2})?, \d{1,4}(?:-\d{0,4})?[a-z]?|n\.d\.)(?=,|$)/)?.[0] ??
              abbr.match(/^[^,\s]+(?:,? [^,\s]+)*?(?: \d{1,4}(?:-\d{0,4})?[a-z]?(?=,|$)|(?=,(?: [a-z]+\.?)? [0-9]))/)?.[0] ??
              abbr
            ))?.slice(2) || ''
        : identity('mark', undefined, signature(clone))?.slice(6) || '';
      return {
        content,
        identifier,
        abbr,
        text: txt,
      };
    }, memory);
    const defs = new Map<string, HTMLLIElement>();
    const identifierInfoCaller = memoize((identifier: string) => ({
      defIndex: 0,
      defSubindex: 0,
      refSubindex: 0,
      title: '' && identifier,
      queue: [] as HTMLElement[],
    }));
    const splitters = splitter
      ? collect(target, `${splitter}, .${list}`)
      : [];
    let iSplitters = 0;
    let total = 0;
    let format: 'number' | 'abbr';
    let refIndex = 0;
    for (let len = refs.length, i = 0; i < len; ++i) {
      if (~i << 32 - 8 === 0) yield;
      const ref = refs[i];
      if (splitter) for (let splitter; splitter = splitters[iSplitters]; ++iSplitters) {
        assert(splitter.parentNode === target || !splitter.parentNode);
        const pos = splitter?.compareDocumentPosition(ref) ?? 0;
        if (pos & (global.Node.DOCUMENT_POSITION_PRECEDING | global.Node.DOCUMENT_POSITION_DISCONNECTED)) break;
        if (~iSplitters << 32 - 8 === 0) yield;
        if (splitter.classList.contains(list) && splitter.nextElementSibling !== splitters[iSplitters + 1]) {
          const note = splitter as HTMLOListElement;
          proc(note);
          note.remove();
          yield note;
          continue;
        }
        if (defs.size > 0) {
          total += defs.size;
          assert(splitter.parentNode);
          const note = splitter.classList.contains(list)
            ? splitter as HTMLOListElement
            : target.insertBefore(html('ol', { class: list }), splitter);
          assert(note.parentNode);
          proc(note, defs);
          assert(defs.size === 0);
          yield note;
        }
      }
      const { content, identifier, abbr, text } = refInfoCaller(ref);
      const info = identifierInfoCaller(identifier);
      const refSubindex = ++info.refSubindex;
      const refId = opts.id !== ''
        ? `${syntax}:${opts.id ?? ''}:ref:${identifier}:${refSubindex}`
        : undefined;
      const initial = splitter
        ? !defs.has(identifier)
        : refSubindex === 1;
      const defSubindex = initial ? ++info.defSubindex : info.defSubindex;
      const defId = opts.id !== ''
        ? `${syntax}:${opts.id ?? ''}:def:${identifier}${splitter && `:${defSubindex}`}`
        : undefined;
      const def = initial
        ? html('li',
            {
              id: defId,
              'data-marker': note ? undefined : marker(total + defs.size + 1, abbr),
            },
            [content, html('sup')])
        : defs.get(identifier)!;
      initial && defs.set(identifier, def);
      assert(def.lastElementChild?.matches('sup'));
      if (!initial && content.innerHTML.length > def.firstElementChild!.innerHTML.length) {
        def.firstElementChild!.replaceWith(content);
      }
      const defIndex = initial
        ? info.defIndex = total + defs.size
        : info.defIndex;
      const title = info.title ||= text;
      assert(syntax !== 'annotation' || title);
      define(ref, {
        id: refId,
        class: opts.local ? `${ref.className} local` : undefined,
        title,
      }, []);
      if (title && info.queue.length > 0) {
        for (const ref of info.queue) {
          define(ref, { title });
          unmarkInvalid(ref);
        }
        info.queue = [];
        def.firstElementChild!.replaceWith(content);
      }
      switch (ref.getAttribute('data-invalid-syntax')) {
        case 'format':
        case 'content':
          unmarkInvalid(ref);
      }
      format ??= abbr ? 'abbr' : 'number';
      if (!ref.classList.contains('invalid')) switch (true) {
        case format === 'number' ? abbr !== '' : abbr === '':
          markInvalid(ref, syntax, 'format', 'Notation format must be consistent with numbers or abbreviations');
          break;
        case title === '':
          markInvalid(ref, syntax, 'content', 'Missing the content');
          info.queue.push(ref);
          break;
      }
      ref.appendChild(html('a', { href: refId && defId && `#${defId}` }, marker(defIndex, abbr)));
      assert(ref.title || ref.matches('.invalid'));
      def.lastElementChild!.appendChild(
        html('a',
          {
            href: refId && `#${refId}`,
            title: abbr && text || undefined,
          },
          `^${++refIndex}`));
    }
    if (note || defs.size > 0) {
      const splitter = splitters[iSplitters++];
      note ??= splitter?.classList.contains(list)
        ? splitter as HTMLOListElement
        : target.insertBefore(html('ol', { class: list }), splitter ?? bottom);
      proc(note, defs);
      assert(defs.size === 0);
      yield note;
    }
    if (splitter) for (let splitter; splitter = splitters[iSplitters]; ++iSplitters) {
      if (~iSplitters << 32 - 8 === 0) yield;
      if (splitter.classList.contains(list)) {
        const note = splitter as HTMLOListElement;
        proc(note);
        splitter.remove();
        yield note;
      }
    }
    assert(opts.id !== '' || !target.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
    assert(opts.id !== '' || !note?.querySelector('[id], .index[href], .label[href]'));
  };
}

function proc(note: HTMLOListElement, defs?: Map<string, HTMLLIElement>): void {
  for (let defs = note.children, i = defs.length; i--;) {
    note.removeChild(defs[i] as HTMLLIElement);
  }
  if (!defs) return;
  for (const [, def] of defs) {
    note.appendChild(def);
  }
  defs.clear();
}
