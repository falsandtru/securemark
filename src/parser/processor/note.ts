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
  for (let es = target.querySelectorAll(`.annotations`),
           len = es.length, i = 0; i < len; ++i) {
    const el = es[i];
    el.parentNode === target && el.remove();
  }
  yield* annotation(target, notes?.annotations, opts, bottom);
  yield* reference(target, notes?.references, opts, bottom);
  return;
}

export const annotation = build('annotation', n => `*${n}`, 'h1, h2, h3, h4, h5, h6, aside.aside, hr');
export const reference = build('reference', (n, abbr) => `[${abbr || n}]`);

function build(
  syntax: 'annotation' | 'reference',
  marker: (index: number, abbr: string) => string,
  splitter: string = '',
) {
  assert(syntax.match(/^[a-z]+$/));
  // Referenceを含むAnnotationの重複排除は両構文が互いに処理済みであることを必要とするため
  // 構文ごとに各1回の処理では不可能
  const memory = memoize((ref: HTMLElement): {
    readonly content: Element;
    readonly identifier: string;
    readonly abbr: string;
    readonly text: string;
  } => {
    const content = ref.firstElementChild!;
    content.replaceWith(content.cloneNode());
    const abbr = ref.getAttribute('data-abbr') ?? '';
    const identifier = abbr
      ? identity(
          undefined,
          (
            abbr.match(/^(?:\S+ )+?(?:(?:January|February|March|April|May|June|August|September|October|November|December) \d{1,2}(?:-\d{0,2})?, \d{1,4}(?:-\d{0,4})?[a-z]?|n\.d\.)(?=,|$)/)?.[0] ??
            abbr.match(/^[^,\s]+(?:,? [^,\s]+)*?(?: \d{1,4}(?:-\d{0,4})?[a-z]?(?=,|$)|(?=,(?: [a-z]+\.?)? [0-9]))/)?.[0] ??
            abbr
          ),
          '')?.slice(2) || ''
      : identity(undefined, signature(content), 'mark')?.slice(6) || '';
    return {
      content,
      identifier,
      abbr,
      text: text(content).trim(),
    };
  }, new WeakMap());
  return function* (
    target: ParentNode & Node,
    note?: HTMLOListElement,
    opts: { readonly id?: string } = {},
    bottom: Node | null = null,
  ): Generator<HTMLAnchorElement | HTMLLIElement | undefined, undefined, undefined> {
    const defs = new Map<string, HTMLLIElement>();
    const refs = target.querySelectorAll(`sup.${syntax}:not(.disabled)`);
    const titles = new Map<string, string>();
    const defIndexes = new Map<HTMLLIElement, number>();
    const refSubindexes = new Map<string, number>();
    const defSubindexes = splitter && refs.length > 0 ? new Map<string, number>() : undefined;
    const splitters = splitter && refs.length > 0 ? target.querySelectorAll(splitter) : [];
    let iSplitters = 0;
    let total = 0;
    let format: 'number' | 'abbr';
    let refIndex = 0;
    for (let len = refs.length, i = 0; i < len; ++i) {
      const ref = refs[i];
      if (!target.contains(ref)) {
        yield;
        continue;
      }
      if (splitter) for (
        let el: Element;
        (el = splitters[iSplitters])?.compareDocumentPosition(ref) & Node.DOCUMENT_POSITION_FOLLOWING;
        ++iSplitters) {
        if (el.parentNode !== target) continue;
        if (defs.size > 0) {
          total += defs.size;
          yield* proc(defs, target.insertBefore(html('ol', { class: `${syntax}s` }), el));
          assert(defs.size === 0);
        }
        else if (~iSplitters % 128 === 0) {
          yield;
        }
      }
      const { content, identifier, abbr, text } = memory(ref);
      const refSubindex = refSubindexes.get(identifier)! + 1 || 1;
      refSubindexes.set(identifier, refSubindex);
      const refId = opts.id !== ''
        ? `${syntax}:${opts.id ?? ''}:ref:${identifier}:${refSubindex}`
        : undefined;
      const initial = splitter
        ? !defs.has(identifier)
        : refSubindex === 1;
      const defSubindex = defSubindexes?.get(identifier)! + +initial || 1;
      initial && defSubindexes?.set(identifier, defSubindex);
      const defId = opts.id !== ''
        ? `${syntax}:${opts.id ?? ''}:def:${identifier}${splitter && `:${defSubindex}`}`
        : undefined;
      const def = initial
        ? html('li',
            {
              id: defId,
              'data-marker': note ? undefined : marker(total + defs.size + 1, abbr),
            },
            [content.cloneNode(true), html('sup')])
        : defs.get(identifier)!;
      initial && defs.set(identifier, def);
      assert(def.lastElementChild?.matches('sup'));
      const defIndex = initial
        ? total + defs.size
        : defIndexes.get(def)!;
      initial && defIndexes.set(def, defIndex);
      const title = initial ? text : titles.get(identifier)!;
      initial && titles.set(identifier, title);
      assert(syntax !== 'annotation' || title);
      ref.childElementCount > 1 && ref.lastElementChild!.remove();
      define(ref, {
        id: refId,
        class: opts.id !== '' ? undefined : void ref.classList.add('disabled'),
        title,
      });
      switch (ref.getAttribute('data-invalid-syntax')) {
        case 'format':
        case 'content':
          unmarkInvalid(ref);
      }
      format ??= abbr ? 'abbr' : 'number';
      if (!ref.classList.contains('invalid')) switch (true) {
        case format === 'number' ? !!abbr : !abbr:
          markInvalid(ref, syntax, 'format', 'Notation format must be consistent with numbers or abbreviations');
          break;
        case !title:
          markInvalid(ref, syntax, 'content', 'Missing the content');
          break;
      }
      yield ref.appendChild(html('a', { href: refId && defId && `#${defId}` }, marker(defIndex, abbr)));
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
      yield* proc(defs, note ?? target.insertBefore(html('ol', { class: `${syntax}s` }), splitters[iSplitters] ?? bottom));
    }
    return;
  }

  function* proc(defs: Map<string, HTMLLIElement>, note: HTMLOListElement): Generator<HTMLLIElement | undefined, undefined, undefined> {
    const { children } = note;
    const size = defs.size;
    let count = 0;
    let length = children.length;
    I:
    for (const [key, def] of defs) {
      defs.delete(key);
      ++count;
      while (length > size) {
        const node = children[count - 1] as HTMLLIElement;
        if (equal(node, def)) continue I;
        yield note.removeChild(node);
        --length;
        assert(children.length === length);
      }
      const node = count <= length
        ? children[count - 1]
        : null;
      if (node && equal(node, def)) continue;
      assert(def.parentNode !== note);
      yield note.insertBefore(def, node);
      ++length;
      assert(children.length === length);
    }
    while (length > size) {
      yield note.removeChild(children[size] as HTMLLIElement);
      --length;
      assert(children.length === length);
    }
    return;
  }
}

function equal(a: Element, b: HTMLElement): boolean {
  return a.id === b.id
      && a.innerHTML === b.innerHTML;
}
