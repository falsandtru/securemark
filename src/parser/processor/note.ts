import { identity, text } from '../inline/extension/indexee';
import { frag, html, define } from 'typed-dom/dom';

export function* note(
  target: ParentNode & Node,
  notes?: { readonly annotations?: HTMLOListElement; readonly references: HTMLOListElement; },
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
  splitter: string = '_',
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
    for (let es = target.querySelectorAll(splitter),
             len = es.length, i = 0; i < len; ++i) {
      if (i % 100 === 0) yield;
      const el = es[i];
      el.parentNode === target && splitters.push(el);
    }
    const refs = target.querySelectorAll(`sup.${syntax}:not(.disabled)`);
    const titles = new Map<string, string>();
    const rixs = new Map<string, number>();
    const dixs = new Map<HTMLLIElement, number>();
    let count = 0;
    let total = 0;
    let style: 'count' | 'abbr';
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
        }
        else if (splitters.length % 100 === 0) {
          yield;
        }
        splitters.shift();
      }
      ++count;
      const abbr = ref.getAttribute('data-abbr') || undefined;
      const identifier = abbr || identity(undefined, text(ref.firstElementChild!), 'mark')?.slice(6) || '';
      const refIndex = rixs.get(identifier)! + 1 || 1;
      rixs.set(identifier, refIndex);
      const refId = opts.id !== ''
        ? `${syntax}:${opts.id ?? ''}:ref:${identifier}:${refIndex}`
        : undefined;
      const initial = refIndex === 1;
      const def = initial
        ? html('li',
            {
              id: opts.id !== '' ? `${syntax}:${opts.id ?? ''}:def:${identifier}` : undefined,
              'data-marker': !note ? marker(total + defs.size + 1, abbr) : undefined,
            },
            [define(ref.firstElementChild!.cloneNode(true), { hidden: null }), html('sup')])
        : defs.get(identifier)!;
      initial && defs.set(identifier, def);
      assert(def.lastChild);
      const defIndex = initial
        ? total + defs.size
        : dixs.get(def)!;
      initial && dixs.set(def, defIndex);
      const defId = def.id || undefined;
      const title = initial
        ? text(ref.firstElementChild!)
        : titles.get(identifier)!;
      initial && titles.set(identifier, title);
      assert(syntax !== 'annotation' || title);
      style ??= abbr ? 'abbr' : 'count';
      if (style === 'count' ? abbr : !abbr) {
        define(ref, {
          class: void ref.classList.add('invalid'),
          'data-invalid-syntax': syntax,
          'data-invalid-type': 'style',
          'data-invalid-message': `${syntax[0].toUpperCase() + syntax.slice(1)} style must be consistent`,
        });
      }
      else if (ref.getAttribute('data-invalid-type') === 'style') {
        define(ref, {
          class: void ref.classList.remove('invalid'),
          'data-invalid-syntax': null,
          'data-invalid-type': null,
          'data-invalid-message': null,
        });
      }
      if (!ref.firstElementChild!.hasAttribute('hidden')) {
        ref.firstElementChild!.setAttribute('hidden', '');
      }
      else {
        ref.lastChild?.remove();
      }
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
          `^${count}`));
    }
    if (defs.size > 0 || note) {
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
