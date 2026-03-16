import { identity, signature, text } from '../inline/extension/indexee';
import { markInvalid, unmarkInvalid } from '../util';
import { memoize } from 'spica/memoize';
import { html, define } from 'typed-dom/dom';

export function* note(
  target: ParentNode & Node,
  notes?: {
    readonly annotations?: HTMLOListElement;
    readonly references: HTMLOListElement;
  },
  opts: { readonly id?: string; } = {},
  bottom: Node | null = null,
): Generator<HTMLAnchorElement | HTMLLIElement | undefined, undefined, undefined> {
  const referenceRefMemory = referenceRefsMemoryCaller(target);
  const annotationRefMemory = annotationRefsMemoryCaller(target);
  for (const memory of [referenceRefMemory, annotationRefMemory]) {
    for (const [ref, { content }] of memory) {
      ref.replaceChildren(content);
    }
    memory.clear();
  }
  yield* reference(referenceRefMemory, target, notes?.references, opts, bottom);
  yield* annotation(annotationRefMemory, target, notes?.annotations, opts, bottom);
}

interface RefMemory {
  readonly content: Element;
  readonly identifier: string;
  readonly abbr: string;
  readonly text: string;
}

const annotationRefsMemoryCaller = memoize((target: Node) =>
  new Map<HTMLElement, RefMemory>() ?? target,
  new WeakMap());

const referenceRefsMemoryCaller = memoize((target: Node) =>
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
  '.annotation:not(:is(.annotations, .references) .annotation, .disabled)',
  n => `*${n}`,
  'h1, h2, h3, h4, h5, h6, aside.aside, hr');
const reference = build(
  'reference',
  'references',
  '.reference:not(:is(.annotations, .references) .reference, .disabled)',
  (n, abbr) => `[${abbr || n}]`);

function build(
  syntax: string,
  list: string,
  query: string,
  marker: (index: number, abbr: string) => string,
  splitter: string = '',
) {
  assert(syntax.match(/^[a-z]+$/));
  splitter &&= `${splitter}, .${list}`;
  return function* (
    memory: Map<HTMLElement, RefMemory>,
    target: ParentNode & Node,
    note?: HTMLOListElement,
    opts: { readonly id?: string } = {},
    bottom: Node | null = null,
  ): Generator<HTMLAnchorElement | HTMLLIElement | undefined, undefined, undefined> {
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
    const refs = target.querySelectorAll<HTMLElement>(query);
    const identifierInfoCaller = memoize((identifier: string) => ({
      defIndex: 0,
      defSubindex: 0,
      refSubindex: 0,
      title: '' && identifier,
      queue: [] as HTMLElement[],
    }));
    const scope = target instanceof Element ? ':scope > ' : '';
    const splitters = splitter ? target.querySelectorAll(`${scope}:is(${splitter})`) : [];
    let iSplitters = 0;
    let total = 0;
    let format: 'number' | 'abbr';
    let refIndex = 0;
    for (let len = refs.length, i = 0; i < len; ++i) {
      const ref = refs[i];
      if (splitter) for (let splitter; splitter = splitters[iSplitters]; ++iSplitters) {
        const pos = splitter?.compareDocumentPosition(ref) ?? 0;
        if (pos & (Node.DOCUMENT_POSITION_PRECEDING | Node.DOCUMENT_POSITION_DISCONNECTED)) break;
        if (~iSplitters << 32 - 8 === 0) yield;
        if (splitter.classList.contains(list) && defs.size === 0) {
          assert(splitter.matches(`.${list}`));
          splitter.remove();
          continue;
        }
        if (defs.size > 0) {
          total += defs.size;
          assert(splitter.parentNode);
          const note = splitter.classList.contains(list)
            ? splitter as HTMLOListElement
            : target.insertBefore(html('ol', { class: list }), splitter);
          assert(note.parentNode);
          yield* proc(defs, note);
          assert(defs.size === 0);
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
      const defIndex = initial
        ? info.defIndex = total + defs.size
        : info.defIndex;
      const title = info.title ||= text;
      assert(syntax !== 'annotation' || title);
      define(ref, {
        id: refId,
        class: opts.id !== '' ? undefined : void ref.classList.add('disabled'),
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
      yield;
    }
    if (note || defs.size > 0) {
      const splitter = splitters[iSplitters++];
      yield* proc(defs, note ?? (splitter?.classList.contains(list)
        ? splitter as HTMLOListElement
        : target.insertBefore(html('ol', { class: list }), splitter ?? bottom)));
      assert(defs.size === 0);
    }
    if (splitter) for (let splitter; splitter = splitters[iSplitters]; ++iSplitters) {
      if (~iSplitters << 32 - 8 === 0) yield;
      if (splitter.classList.contains(list)) {
        splitter.remove();
      }
    }
  }
}

function* proc(defs: Map<string, HTMLLIElement>, note: HTMLOListElement): Generator<HTMLLIElement | undefined, undefined, undefined> {
  const { children } = note;
  for (let defs = note.children, i = defs.length; i--;) {
    yield note.removeChild(children[i] as HTMLLIElement);
  }
  for (const [, def] of defs) {
    yield note.appendChild(def);
  }
  defs.clear();
}
