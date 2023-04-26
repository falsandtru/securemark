import { identity, text } from '../inline/extension/indexee';
import { markInvalid, unmarkInvalid } from '../util';
import { frag, html, define } from 'typed-dom/dom';

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
  marker: (index: number, abbr: string | undefined) => string,
  splitter: string = '',
) {
  assert(syntax.match(/^[a-z]+$/));
  // Referenceを含むAnnotationの重複排除は両構文が互いに処理済みであることを必要とするため
  // 構文ごとに各1回の処理では不可能
  return function* (
    target: ParentNode & Node,
    note?: HTMLOListElement,
    opts: { readonly id?: string } = {},
    bottom: Node | null = null,
  ): Generator<HTMLAnchorElement | HTMLLIElement | undefined, undefined, undefined> {
    const defs = new Map<string, HTMLLIElement>();
    const splitters: Element[] = [];
    for (let es = target.querySelectorAll(splitter || '_'),
             len = es.length, i = 0; i < len; ++i) {
      if (i % 100 === 0) yield;
      const el = es[i];
      el.parentNode === target && splitters.push(el);
    }
    const refs = target.querySelectorAll(`sup.${syntax}:not(.disabled)`);
    const titles = new Map<string, string>();
    const defIndexes = new Map<HTMLLIElement, number>();
    const refSubindexes = new Map<string, number>();
    const defSubindexes = splitter ? new Map<string, number>() : undefined;
    let total = 0;
    let format: 'number' | 'abbr';
    let refIndex = 0;
    for (let len = refs.length, i = 0; i < len; ++i) {
      const ref = refs[i];
      if (ref.closest('[hidden]')) {
        yield;
        continue;
      }
      while (splitters.length > 0
          && splitters[0].compareDocumentPosition(ref) & Node.DOCUMENT_POSITION_FOLLOWING) {
        if (defs.size > 0) {
          total += defs.size;
          yield* proc(defs, target.insertBefore(html('ol', { class: `${syntax}s` }), splitters[0]));
          assert(defs.size === 0);
        }
        else if (splitters.length % 100 === 0) {
          yield;
        }
        splitters.shift();
      }
      const abbr = ref.getAttribute('data-abbr') || undefined;
      const identifier = abbr || identity(undefined, text(ref.firstElementChild!), 'mark')?.slice(6) || '';
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
            [define(ref.firstElementChild!.cloneNode(true), { hidden: null }), html('sup')])
        : defs.get(identifier)!;
      initial && defs.set(identifier, def);
      assert(def.lastChild);
      const defIndex = initial
        ? total + defs.size
        : defIndexes.get(def)!;
      initial && defIndexes.set(def, defIndex);
      const title = initial
        ? text(ref.firstElementChild!)
        : titles.get(identifier)!;
      initial && titles.set(identifier, title);
      assert(syntax !== 'annotation' || title);
      format ??= abbr ? 'abbr' : 'number';
      if (!ref.classList.contains('invalid')) {
        if (format === 'number' ? abbr : !abbr) {
          markInvalid(ref, syntax, 'format', 'Notation format must be consistent with numbers or abbreviations');
        }
      }
      else switch (ref.getAttribute('data-invalid-syntax')) {
        case 'format':
        case 'content':
          unmarkInvalid(ref);
      }
      ref.firstElementChild!.hasAttribute('hidden')
        ? ref.lastElementChild!.remove()
        : ref.firstElementChild!.setAttribute('hidden', '');
      define(ref, {
        id: refId,
        class: opts.id !== '' ? undefined : void ref.classList.add('disabled'),
        title,
        ...!title && {
          class: void ref.classList.add('invalid'),
          'data-invalid-syntax': syntax,
          'data-invalid-type': 'content',
          'data-invalid-message': 'Missing the content',
        },
      });
      yield ref.appendChild(html('a', { href: refId && defId && `#${defId}` }, marker(defIndex, abbr)));
      assert(ref.title || ref.matches('.invalid'));
      def.lastChild!.appendChild(
        html('a',
          {
            href: refId && `#${refId}`,
            title: abbr && text(frag(ref.firstElementChild!.cloneNode(true).childNodes)).trim() || undefined,
          },
          `^${++refIndex}`));
    }
    if (note || defs.size > 0) {
      yield* proc(defs, note ?? target.insertBefore(html('ol', { class: `${syntax}s` }), splitters[0] ?? bottom));
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
