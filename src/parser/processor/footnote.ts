import { identity, text } from '../inline/extension/indexee';
import { frag, html, define } from 'typed-dom/dom';

export function* footnote(
  target: ParentNode & Node,
  footnotes?: { readonly annotations?: HTMLOListElement; readonly references: HTMLOListElement; },
  opts: { readonly id?: string; } = {},
  bottom: Node | null = null,
): Generator<HTMLAnchorElement | HTMLLIElement | undefined, undefined, undefined> {
  for (let es = target.querySelectorAll(`.annotations`),
           len = es.length, i = 0; i < len; ++i) {
    const el = es[i];
    el.parentNode === target && el.remove();
  }
  yield* annotation(target, footnotes?.annotations, opts, bottom);
  yield* reference(target, footnotes?.references, opts, bottom);
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
    footnote?: HTMLOListElement,
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
    const indexes = new Map<HTMLLIElement, number>();
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
      const abbr = ref.getAttribute('data-abbr') || undefined;
      const identifier = abbr || identity(undefined, text(ref.firstElementChild!), 'mark')?.slice(6) || '';
      const title = undefined
        || titles.get(identifier)
        || titles.set(identifier, text(ref.firstElementChild!)).get(identifier)!
        || null;
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
      const refIndex = ++count;
      const refId = opts.id !== ''
        ? `${syntax}:${opts.id ?? ''}:ref:${refIndex}`
        : undefined;
      const def = undefined
        || defs.get(identifier)
        || defs.set(identifier, html('li',
            {
              id: opts.id !== '' ? `${syntax}:${opts.id ?? ''}:def:${identifier}` : undefined,
              'data-marker': !footnote ? marker(total + defs.size + 1, abbr) : undefined,
            },
            [define(ref.firstElementChild!.cloneNode(true), { hidden: null }), html('sup')]))
            .get(identifier)!;
      assert(def.lastChild);
      const defIndex = undefined
        || indexes.get(def)
        || indexes.set(def, total + defs.size).get(def)!;
      const defId = def.id || undefined;
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
          `^${refIndex}`));
    }
    if (defs.size > 0 || footnote) {
      yield* proc(defs, footnote ?? target.insertBefore(html('ol', { class: `${syntax}s` }), splitters[0] ?? bottom));
    }
    return;
  }

  function* proc(defs: Map<string, HTMLLIElement>, footnote: HTMLOListElement): Generator<HTMLLIElement | undefined, undefined, undefined> {
    const { children } = footnote;
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
        yield footnote.removeChild(node);
        --length;
        assert(children.length === length);
      }
      const node = count <= length
        ? children[count - 1]
        : null;
      if (node && equal(node, def)) continue;
      assert(def.parentNode !== footnote);
      yield footnote.insertBefore(def, node);
      ++length;
      assert(children.length === length);
    }
    while (length > size) {
      yield footnote.removeChild(children[size] as HTMLLIElement);
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
